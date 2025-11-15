import { callAgent } from '@/lib/agents'
import { MongoClient } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

const client = new MongoClient(process.env.MONGODB_ATLAS_URI!, {
  tls: true,
  tlsInsecure: false,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    const threadId = Date.now().toString()

    await client.connect()
    const response = await callAgent(client, message, threadId)

    return NextResponse.json({ threadId, response })
  } catch (error) {
    console.error('Error starting chat thread', error)
    return NextResponse.json({ error: 'Error starting chat thread' }, { status: 500 })
  }
}

