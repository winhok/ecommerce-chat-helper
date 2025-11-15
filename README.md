# E-commerce Chat Helper

An intelligent AI-powered chatbot for furniture e-commerce stores built with Next.js, LangGraph, and Google's Gemini AI. The chatbot uses MongoDB Atlas for vector search to help customers find and learn about furniture products.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)

## Features

- 🤖 **AI-Powered Chat Assistant** - Uses Google's Gemini AI with LangGraph for intelligent conversations
- 🔍 **Vector Search** - Semantic search over furniture inventory using MongoDB Atlas Vector Search
- 💬 **Conversation Memory** - Persistent chat threads with checkpointing for multi-turn conversations
- 🪑 **Furniture Store UI** - Clean, responsive e-commerce interface
- 🎨 **Modern Stack** - Built with Next.js 16 App Router, React 19, and Tailwind CSS 4
- 📦 **Full-Stack** - API routes and frontend in a unified codebase

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with latest features
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Icons** - Icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **LangGraph** - Agent orchestration framework
- **Google Gemini AI** - LLM for chat and embeddings (`gemini-2.5-flash`, `gemini-embedding-exp-03-07`)
- **MongoDB Atlas** - Database with vector search capabilities
- **TypeScript** - Type-safe development

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- MongoDB Atlas account with cluster
- Google API key for Gemini AI

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-chat-helper
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the project root:
   ```env
   MONGODB_ATLAS_URI="mongodb+srv://username:password@cluster.mongodb.net/"
   GOOGLE_API_KEY="your-google-api-key"
   GOOGLE_API_BASE_URL="https://generativelanguage.googleapis.com" # Optional
   ```

## Getting Started

### 1. Seed the Database

Generate synthetic furniture data and create vector embeddings:

```bash
npx tsx src/lib/seed-database.ts
```

This will:
- Create the `inventory_database` database and `items` collection
- Generate 10 synthetic furniture items using Gemini AI
- Create vector embeddings for semantic search
- Set up the MongoDB Atlas vector search index

### 2. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 3. Start Chatting

Click the chat widget button in the bottom-right corner and ask about furniture items!

## Project Structure

```
/src
  /app
    /api
      /chat
        route.ts              # POST /api/chat - Start new chat thread
        /[threadId]
          route.ts            # POST /api/chat/:threadId - Continue thread
    page.tsx                  # Homepage
  /components
    ChatWidget.tsx            # Client-side chat interface
    EcommerceStore.tsx        # E-commerce storefront UI
  /lib
    agents.ts                 # LangGraph agent implementation
    seed-database.ts          # Database seeding script
```

## How It Works

### Chat Flow

1. User sends a message through the `ChatWidget` component
2. Message is sent to `/api/chat` (new thread) or `/api/chat/:threadId` (existing thread)
3. LangGraph agent processes the message:
   - Agent decides if it needs to use the `item_lookup` tool
   - Tool performs vector similarity search on MongoDB Atlas
   - Falls back to text search if no vector results
4. Agent generates response using Gemini AI
5. Response is returned to the user and conversation state is saved

### Agent Architecture

The LangGraph agent follows this flow:
```
__start__ → agent → (tools?) → agent → __end__
```

- **State**: Messages array with conversation history
- **Tools**: `item_lookup` for searching furniture inventory
- **Checkpointing**: MongoDB-based persistence for multi-turn conversations
- **Retry Logic**: Exponential backoff for rate limiting (429 errors)

### Vector Search

1. User query is embedded using `gemini-embedding-exp-03-07`
2. MongoDB Atlas vector search finds similar furniture items (cosine similarity)
3. If no results, falls back to regex text search across item fields
4. Results include item details, prices, reviews, and more

## API Endpoints

### `POST /api/chat`
Start a new chat thread.

**Request:**
```json
{
  "message": "Show me some sofas"
}
```

**Response:**
```json
{
  "threadId": "1234567890",
  "response": "Here are some sofas from our collection..."
}
```

### `POST /api/chat/:threadId`
Continue an existing conversation.

**Request:**
```json
{
  "message": "What about the blue one?"
}
```

**Response:**
```json
{
  "response": "The blue sofa is..."
}
```

## Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Development Commands

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Seed database
npx tsx src/lib/seed-database.ts
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_ATLAS_URI` | MongoDB Atlas connection string | ✅ |
| `GOOGLE_API_KEY` | Google Gemini API key | ✅ |
| `GOOGLE_API_BASE_URL` | Custom Google API base URL | ❌ |

## MongoDB Setup

1. Create a MongoDB Atlas cluster
2. Create a database named `inventory_database`
3. The seeding script will automatically:
   - Create the `items` collection
   - Set up the vector search index (`vector_index`)
   - Populate with synthetic furniture data

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings
4. Deploy!

### Other Platforms

This Next.js app can be deployed to any platform supporting Node.js:
- Railway
- Render
- AWS Amplify
- Google Cloud Run
- DigitalOcean App Platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [MongoDB Atlas Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/)
- [Google Gemini AI](https://ai.google.dev/)
