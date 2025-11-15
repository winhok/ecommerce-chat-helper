'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { FaCommentDots, FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa'

interface Message {
  text: string
  isAgent: boolean
  thredId?: string
}

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [thredId, setThredId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessages = [
        {
          text: 'Hello! I am your E-commerce Chatbot. How can I help you today?',
          isAgent: true,
        },
      ]
      setMessages(initialMessages)
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  console.log(messages)

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(inputValue)

    const message = {
      text: inputValue,
      isAgent: false,
    }

    setMessages(prevMessages => [...prevMessages, message])
    setInputValue('')

    const endpoint = thredId ? `/api/chat/${thredId}` : '/api/chat'

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      })
      if (!response.ok) {
        throw new Error(`Failed to send message! Status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Response:', data)
      const agentResponse = {
        text: data.response,
        isAgent: true,
        thredId: data.threadId,
      }

      setMessages(prevMessages => [...prevMessages, agentResponse])
      setThredId(data.threadId)
      console.log(messages)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
  return (
    <div
      className={`fixed bottom-5 right-5 z-1000 flex flex-col transition-all duration-300 overflow-hidden ${
        isOpen ? 'w-[350px] h-[500px] bg-white rounded-t-[10px]' : 'w-auto h-auto bg-purple-600 rounded-full shadow-2xl'
      }`}
    >
      {isOpen ? (
        <>
          <div className='bg-linear-to-r from-purple-600 to-purple-700 text-white px-4 py-3 flex items-center justify-between'>
            <div className='flex items-center gap-2.5'>
              <FaRobot />
              <h3 className='text-base'>Shop Assistant</h3>
            </div>
            <button className='bg-transparent border-none text-white cursor-pointer text-lg hover:text-gray-100' onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          <div className='flex-1 px-4 py-3 overflow-y-auto flex flex-col gap-2.5'>
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`max-w-xs px-4 py-2.5 rounded-3xl text-sm leading-[1.4] ${
                    message.isAgent ? 'self-start bg-gray-100 text-gray-900 rounded-bl-[5px]' : 'self-end bg-purple-600 text-white rounded-br-[5px]'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className='flex gap-2.5 p-2.5 border-t border-gray-200' onSubmit={handleSendMessage}>
            <input
              type='text'
              className='flex-1 border border-gray-200 px-4 py-2.5 rounded-full outline-none text-sm focus:border-purple-600'
              placeholder='Type your message...'
              value={inputValue}
              onChange={handleInputChange}
            />
            <button
              type='submit'
              className={`flex items-center justify-center w-10 h-10 rounded-full text-white border-none cursor-pointer transition-colors ${
                inputValue.trim() === '' ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
              }`}
              disabled={inputValue.trim() === ''}
            >
              <FaPaperPlane size={16} />
            </button>
          </form>
        </>
      ) : (
        <button
          className='w-15 h-15 rounded-full bg-purple-600 text-white border-none flex items-center justify-center cursor-pointer text-2xl hover:bg-purple-700 transition-colors'
          onClick={toggleChat}
        >
          <FaCommentDots />
        </button>
      )}
    </div>
  )
}

export default ChatWidget
