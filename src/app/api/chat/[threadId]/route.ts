import { callAgent } from '@/lib/agents'
import { MongoClient } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

const client = new MongoClient(process.env.MONGODB_ATLAS_URI!, {
  tls: true,
  tlsInsecure: false,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})

export async function POST(request: NextRequest, { params }: { params: { threadId: string } }) {
  try {
    const { message } = await request.json()
    const { threadId } = params

    await client.connect()
    const response = await callAgent(client, message, threadId)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error continuing chat thread', error)
    return NextResponse.json({ error: 'Error continuing chat thread' }, { status: 500 })
  }
}

