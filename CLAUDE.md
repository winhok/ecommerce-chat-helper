# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an E-commerce Chat Helper application that uses LangGraph and Google's Gemini AI to create an intelligent chatbot for a furniture store. The system uses MongoDB Atlas for both persistence (checkpointing) and vector search capabilities to query a furniture inventory database.

## Development Commands

All commands should be run from the `server/` directory:

```bash
# Install dependencies (uses pnpm)
cd server
pnpm install

# Run the development server
pnpm dev

# Seed the database with synthetic furniture data
pnpm seed
```

## Environment Variables

Required environment variables (create a `.env` file in the `server/` directory):

- `MONGODB_ATLAS_URI`: MongoDB Atlas connection string
- `GOOGLE_API_KEY`: Google Gemini API key
- `GOOGLE_API_BASE_URL`: (Optional) Custom base URL for Google API
- `PORT`: (Optional) Server port, defaults to 8000

## Architecture

### Core Components

**server/index.ts**
- Express server with CORS enabled
- Two main endpoints:
  - `POST /chat`: Starts new chat thread, generates thread ID from timestamp
  - `POST /chat/:threadId`: Continues existing conversation thread
- MongoDB connection management

**server/agents.ts**
- Contains the LangGraph agent implementation using `StateGraph`
- **Agent Flow**: `__start__` → `agent` → conditionally `tools` → `agent` (loop) → `__end__`
- Uses `MongoDBSaver` for conversation checkpointing (persists state between requests)
- Implements retry logic with exponential backoff for rate limiting (status 429)
- Tool: `item_lookup` - performs vector similarity search on furniture inventory, falls back to text search if no vector results

**server/seed-database.ts**
- Generates synthetic furniture data using Gemini LLM with structured output parsing
- Creates vector embeddings using Google's `text-embedding-004` model
- Sets up MongoDB Atlas vector search index with 768 dimensions, cosine similarity
- Each item includes: item_id, item_name, item_description, brand, manufacturer_address, prices, categories, user_reviews, notes

### MongoDB Collections

**Database**: `inventory_database`
- **Collection**: `items` - stores furniture items with vector embeddings
- **Index**: `vector_index` - vectorSearch type on `embedding` field (768 dimensions)
- **Checkpoint Collection**: Used by MongoDBSaver for LangGraph state persistence

### LangGraph State Management

The agent uses LangGraph's `StateGraph` with message-based state:
- State schema: `{ messages: BaseMessage[] }` with concat reducer
- Conditional edges based on tool calls in the last AI message
- Recursion limit: 15 iterations
- Thread-based conversation persistence via `configurable.thread_id`

### Vector Search Strategy

The `item_lookup` tool implements a two-tier search:
1. **Primary**: Vector similarity search using embeddings
2. **Fallback**: Regex text search on item_name, item_description, categories, embedding_text if vector search returns no results

### Key Dependencies

- **LangChain/LangGraph**: Agent orchestration, tools, checkpointing
- **@langchain/google-genai**: Gemini LLM and embeddings
- **@langchain/mongodb**: Vector store integration
- **MongoDB**: Native driver for Atlas connection
- **Express**: REST API server
- **TypeScript**: Full ESM module support with `ts-node`

## TypeScript Configuration

Uses strict TypeScript settings with ESM modules (`"module": "nodenext"`). The project uses `.ts` file extensions in imports and runs via `ts-node` with `transpileOnly` mode.
