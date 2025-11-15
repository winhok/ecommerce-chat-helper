# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an E-commerce Chat Helper application built with **Next.js 16** (App Router) that uses LangGraph and Google's Gemini AI to create an intelligent chatbot for a furniture store. The system uses MongoDB Atlas for both persistence (checkpointing) and vector search capabilities to query a furniture inventory database.

## Development Commands

All commands run from the project root:

```bash
# Install dependencies (uses pnpm)
pnpm install

# Run the development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Seed the database with synthetic furniture data
npx tsx src/lib/seed-database.ts
```

## Environment Variables

Required environment variables (create `.env.local` in project root):

- `MONGODB_ATLAS_URI`: MongoDB Atlas connection string
- `GOOGLE_API_KEY`: Google Gemini API key
- `GOOGLE_API_BASE_URL`: (Optional) Custom base URL for Google API

## Architecture

This is a **full-stack Next.js application** using the App Router. Frontend and backend are unified in a single codebase.

### API Routes (Backend)

**src/app/api/chat/route.ts**
- Next.js API route handling `POST /api/chat`
- Starts new chat thread, generates thread ID from timestamp
- Returns `{ threadId, response }`
- MongoDB client initialized per route with connection pooling considerations

**src/app/api/chat/[threadId]/route.ts**
- Next.js API route handling `POST /api/chat/:threadId`
- Continues existing conversation thread using thread ID
- Returns `{ response }`

### Core Server Logic (src/lib/)

**src/lib/agents.ts**
- Contains the LangGraph agent implementation using `StateGraph`
- **Agent Flow**: `__start__` → `agent` → conditionally `tools` → `agent` (loop) → `__end__`
- Uses `MongoDBSaver` for conversation checkpointing (persists state between requests)
- Implements retry logic with exponential backoff for rate limiting (status 429)
- Model: `gemini-2.5-flash` with temperature 0
- Tool: `item_lookup` - performs vector similarity search on furniture inventory, falls back to text search if no vector results

**src/lib/seed-database.ts**
- Generates synthetic furniture data using Gemini LLM with structured output parsing
- Creates vector embeddings using Google's `gemini-embedding-exp-03-07` model
- Sets up MongoDB Atlas vector search index with 768 dimensions, cosine similarity
- Each item includes: item_id, item_name, item_description, brand, manufacturer_address, prices, categories, user_reviews, notes

### Frontend (React Components)

**src/app/page.tsx**
- Main homepage rendering `EcommerceStore` and `ChatWidget` components

**src/components/ChatWidget.tsx**
- Client component (`'use client'`) for interactive chat interface
- Uses React hooks for state management (messages, threadId)
- Fetches from `/api/chat` and `/api/chat/:threadId` endpoints
- Styled with Tailwind CSS
- Features: auto-scroll, loading states, form handling

**src/components/EcommerceStore.tsx**
- Client component displaying the e-commerce storefront UI

### MongoDB Collections

**Database**: `inventory_database`
- **Collection**: `items` - stores furniture items with vector embeddings
- **Index**: `vector_index` - vectorSearch type on `embedding` field (768 dimensions, cosine similarity)
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

- **Next.js 16**: Full-stack React framework with App Router
- **React 19**: Frontend UI library
- **LangChain/LangGraph**: Agent orchestration, tools, checkpointing
- **@langchain/google-genai**: Gemini LLM and embeddings
- **@langchain/mongodb**: Vector store integration
- **MongoDB**: Native driver for Atlas connection
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript 5**: Type-safe development
- **Zod**: Schema validation for structured outputs

## TypeScript Configuration

Uses TypeScript 5 with Next.js-optimized settings. The project uses standard `.ts`/`.tsx` extensions with Next.js path aliases (`@/` maps to `src/`).

## Project Structure

```
/src
  /app
    /api/chat          # API routes for chat endpoints
    page.tsx           # Homepage
  /components          # React client components
  /lib                 # Server-side utilities (agents, seeding)
```
