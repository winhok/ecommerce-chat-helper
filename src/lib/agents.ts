import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { tool } from '@langchain/core/tools'
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { Annotation, StateGraph } from '@langchain/langgraph'
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'
import { MongoClient } from 'mongodb'
import { z } from 'zod'

async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: any) {
      if (error.status === 429 && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000)
        console.log(`Attempt ${attempt} failed, retrying in ${delay / 1000}seconds...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
  throw new Error(`Failed to execute function after ${maxRetries} attempts`)
}

export async function callAgent(client: MongoClient, query: string, thread_id: string): Promise<string> {
  try {
    const dbName = 'inventory_database'
    const db = client.db(dbName)
    const collection = db.collection('items')
    const GraphState = Annotation.Root({
      messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
      }),
    })
    const itemLookupTool = tool(
      async ({ query, n = 10 }) => {
        try {
          console.log('Item Lookup Tool called with query:', query)
          const totalCount = await collection.countDocuments()
          console.log(`Total documents in collection: ${totalCount}`)

          if (totalCount === 0) {
            console.log('No items found in the database')
            return JSON.stringify({
              error: 'No items found in the database',
              message: 'The database is empty',
              count: 0,
            })
          }

          const sampleDocs = await collection.find({}).limit(3).toArray()
          console.log(`Found ${sampleDocs} sample documents`)

          const dbConfig = {
            collection: collection,
            indexName: 'vector_index',
            textKey: 'embedding_text',
            embeddingKey: 'embedding',
          }

          const vectorStore = new MongoDBAtlasVectorSearch(
            new GoogleGenerativeAIEmbeddings({
              apiKey: process.env.GOOGLE_API_KEY || '',
              ...(process.env.GOOGLE_API_BASE_URL && { baseUrl: process.env.GOOGLE_API_BASE_URL }),
              modelName: 'gemini-embedding-exp-03-07',
            }),
            dbConfig
          )
          console.log('Performing vector search...')
          const results = await vectorStore.similaritySearch(query, n)
          console.log(`Found ${results.length} results`)

          if (results.length === 0) {
            console.log('Vector search returned no results, trying text search...')
            const textResults = await collection
              .find({
                $or: [
                  { item_name: { $regex: query, $options: 'i' } },
                  { item_description: { $regex: query, $options: 'i' } },
                  { categories: { $regex: query, $options: 'i' } },
                  { embedding_text: { $regex: query, $options: 'i' } },
                ],
              })
              .limit(n)
              .toArray()
            console.log(`Found ${textResults.length} text search results`)

            return JSON.stringify({
              results: textResults,
              sertchType: 'text',
              query: query,
              count: textResults.length,
            })
          }
          return JSON.stringify({
            results: results,
            sertchType: 'vector',
            query: query,
            count: results.length,
          })
        } catch (error: any) {
          console.error('Error in Item Lookup Tool', error)
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
          })

          return JSON.stringify({
            error: 'Failed to search inventory',
            details: error.message,
            query: query,
          })
        }
      },
      {
        name: 'item_lookup',
        description: 'Gathers furniture item details from the inventory database',
        schema: z.object({ query: z.string(), n: z.number().optional().default(10).describe('Number of results to return') }),
      }
    )

    const tools = [itemLookupTool]
    const toolNode = new ToolNode<typeof GraphState.State>(tools)

    const Model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      temperature: 0,
      maxRetries: 0,
      ...(process.env.GOOGLE_API_BASE_URL && { baseUrl: process.env.GOOGLE_API_BASE_URL }),
      apiKey: process.env.GOOGLE_API_KEY || '',
    }).bindTools(tools)

    function shouldContinue(state: typeof GraphState.State) {
      const messages = state.messages
      const lastMessage = messages[messages.length - 1] as AIMessage

      if (lastMessage.tool_calls?.length) {
        return 'tools'
      }
      return '__end__'
    }

    async function callModel(state: typeof GraphState.State) {
      return retryWithBackoff(async () => {
        const prompt = ChatPromptTemplate.fromMessages([
          [
            'system',
            `You are a helpful E-commerce Chatbot Agent for a furniture store.
							
							IMPORTANT: You have access to an item_lookup tool that searches the furniture inventory database. ALWAYS use this tool when customers ask about furniture items, even if the tool returns error or empty results.

							When using the item_lookup tool:
							- If it returns results, provide helpful details about the furniture items
							- If it returns an error or no results, acknowledge this and offer to help in other ways.
							- If the database appears to be empty, let the customer know that inventory might be being updated.

							Current time: {time}
							`,
          ],
          new MessagesPlaceholder('messages'),
        ])

        const formattedPrompt = await prompt.formatMessages({
          time: new Date().toISOString(),
          messages: state.messages,
        })

        const result = await Model.invoke(formattedPrompt)
        return { messages: [result] }
      })
    }

    const workflow = new StateGraph(GraphState)
      .addNode('agent', callModel)
      .addNode('tools', toolNode)
      .addEdge('__start__', 'agent')
      .addConditionalEdges('agent', shouldContinue)
      .addEdge('tools', 'agent')

    const checkpointer = new MongoDBSaver({ client, dbName })
    const app = workflow.compile({ checkpointer })

    const finalState = await app.invoke(
      {
        messages: [new HumanMessage(query)],
      },
      {
        recursionLimit: 15,
        configurable: {
          thread_id: thread_id,
          checkpoint_ns: '',
          checkpoint_id: `${thread_id}-checkpoint`,
        },
      }
    )

    const response = finalState.messages[finalState.messages.length - 1]!.content as string

    console.log('Agent response:', response)

    return response
  } catch (error: any) {
    console.error('Error calling agent', error.message)

    if (error.state === 429) {
      throw new Error('Rate limit exceeded. Please try again later.')
    } else if (error.state === 401) {
      throw new Error('Authentication failed. Please check your API key and try again.')
    } else {
      throw new Error(`Agent failed: ${error.message}`)
    }
  }
}
