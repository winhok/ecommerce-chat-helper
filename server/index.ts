import cors from 'cors'
import 'dotenv/config'
import express, { type Request, type Response } from 'express'
import { MongoClient } from 'mongodb'
import { callAgent } from './agents.ts'

const app = express()
app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string)
async function startServer() {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('Connected to MongoDB Atlas')

    app.get('/', (req: Request, res: Response) => {
      res.send('LangGraph Agent is running')
    })

    app.post('/chat', async (req: Request, res: Response) => {
      const initalMessage = req.body.message
      const threadId = Date.now().toString()
      console.log(`New chat thread started: ${threadId} with initial message: ${initalMessage}`)
      try {
        const response = await callAgent(client, initalMessage, threadId)
        res.json({ threadId, response })
      } catch (error) {
        console.error('Error starting chat thread', error)
        res.status(500).json({ error: 'Error starting chat thread' })
      }
    })

    app.post('/chat/:threadId', async (req: Request, res: Response) => {
      const { thread_id } = req.params
      const { message } = req.body
      try {
        const response = await callAgent(client, message, thread_id as string)
        res.json({ response })
      } catch (error) {
        console.error('Error continuing chat thread', error)
        res.status(500).json({ error: 'Error continuing chat thread' })
      }
    })

    const port = process.env.PORT || 8000
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas', error)
    process.exit(1)
  }
}
startServer()
