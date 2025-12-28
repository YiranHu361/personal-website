'use client'

import { motion } from 'framer-motion'
import { CornerDownLeft, Maximize2, Minimize2 } from 'lucide-react'
import { useState, useRef, useCallback, useEffect } from 'react'

interface TerminalMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface TerminalProps {
  ownerName: string
  nestRef?: React.RefObject<HTMLDivElement | null>
}

let messageCounter = 0

export default function Terminal({ ownerName, nestRef }: TerminalProps) {
  const [messages, setMessages] = useState<TerminalMessage[]>([
    {
      id: 'boot',
      role: 'system',
      content: `SYSTEM READY // ${ownerName.toUpperCase()} DATASTREAM ONLINE`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDocked, setIsDocked] = useState(true)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const terminalRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Auto-scroll within container only (not the page)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    // Abort any pending request
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()

    const userMessage: TerminalMessage = {
      id: `user-${++messageCounter}`,
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${++messageCounter}`,
          role: 'assistant',
          content: data.reply ?? 'No response received.',
        },
      ])
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // Request was aborted, don't show error
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${++messageCounter}`,
          role: 'assistant',
          content: 'Connection fault. Retry or check API key.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUndock = () => {
    setIsDocked(false)
    // Position at bottom right when undocked, with bounds checking
    const x = Math.min(window.innerWidth - 340, window.innerWidth - 20)
    const y = Math.min(window.innerHeight - 320, window.innerHeight - 20)
    setPosition({ x: Math.max(0, x), y: Math.max(0, y) })
  }

  const handleDock = () => {
    setIsDocked(true)
    setPosition({ x: 0, y: 0 })
  }

  // Check if terminal is near the nest to snap back
  // Note: This uses screen position which works after drag ends
  const checkDockProximity = useCallback(() => {
    if (!nestRef?.current || !terminalRef.current) return

    const nestRect = nestRef.current.getBoundingClientRect()
    const terminalRect = terminalRef.current.getBoundingClientRect()

    // Check if terminal center is within 150px of nest center
    const nestCenterX = nestRect.left + nestRect.width / 2
    const nestCenterY = nestRect.top + nestRect.height / 2
    const terminalCenterX = terminalRect.left + terminalRect.width / 2
    const terminalCenterY = terminalRect.top + terminalRect.height / 2

    const distance = Math.sqrt(
      Math.pow(nestCenterX - terminalCenterX, 2) +
      Math.pow(nestCenterY - terminalCenterY, 2)
    )

    if (distance < 150) {
      setIsDocked(true)
      setPosition({ x: 0, y: 0 })
    }
  }, [nestRef])

  const MessageList = () => (
    <>
      {messages.map((message) => (
        <div key={message.id} className="space-y-1">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#7209b7]">
            {message.role === 'assistant' ? 'system.ai' : message.role}
          </div>
          <div>{message.content}</div>
        </div>
      ))}
      {isLoading && <div className="text-[10px] uppercase tracking-[0.3em]">Querying...</div>}
    </>
  )

  // If docked and nestRef exists, render in the nest position
  if (isDocked && nestRef) {
    return (
      <div
        ref={terminalRef}
        className="w-full border border-[#111] bg-[#f8f9fa] hard-shadow"
      >
        <div
          className="flex items-center justify-between border-b border-[#111] px-4 py-3 text-[10px] uppercase tracking-[0.3em]"
        >
          <span>AI Terminal</span>
          <div className="flex items-center gap-3">
            <span className="text-[#4cc9f0]">GPT-4o</span>
            <button
              onClick={handleUndock}
              className="hover:text-[#7209b7] transition-colors"
              title="Undock terminal"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        </div>
        <div ref={messagesContainerRef} className="max-h-48 space-y-3 overflow-y-auto px-4 py-3 text-xs">
          <MessageList />
        </div>
        <div className="border-t border-[#111] px-3 py-3">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSubmit()
                }
              }}
              data-cursor="text"
              className="w-full border border-[#111] bg-transparent px-2 py-2 text-xs uppercase tracking-[0.3em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4cc9f0]"
              placeholder="Ask about me"
            />
            <button
              type="button"
              data-cursor="hover"
              onClick={handleSubmit}
              className="flex h-9 w-9 items-center justify-center border border-[#111] bg-[#111] text-[#f8f9fa]"
            >
              <CornerDownLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Floating/undocked mode
  return (
    <motion.div
      ref={terminalRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragEnd={checkDockProximity}
      initial={false}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 z-40 w-[320px] border border-[#111] bg-[#f8f9fa] hard-shadow"
      style={{ touchAction: 'none' }}
    >
      <div
        className="flex items-center justify-between border-b border-[#111] px-4 py-3 text-[10px] uppercase tracking-[0.3em] cursor-grab active:cursor-grabbing"
        data-cursor="drag"
      >
        <span>AI Terminal</span>
        <div className="flex items-center gap-3">
          <span className="text-[#4cc9f0]">GPT-4o</span>
          <button
            onClick={handleDock}
            className="hover:text-[#7209b7] transition-colors"
            title="Dock terminal"
          >
            <Minimize2 size={12} />
          </button>
        </div>
      </div>
      <div ref={messagesContainerRef} className="max-h-56 space-y-3 overflow-y-auto px-4 py-3 text-xs">
        <MessageList />
      </div>
      <div className="border-t border-[#111] px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSubmit()
              }
            }}
            data-cursor="text"
            className="w-full border border-[#111] bg-transparent px-2 py-2 text-xs uppercase tracking-[0.3em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4cc9f0]"
            placeholder="Ask about me"
          />
          <button
            type="button"
            data-cursor="hover"
            onClick={handleSubmit}
            className="flex h-9 w-9 items-center justify-center border border-[#111] bg-[#111] text-[#f8f9fa]"
          >
            <CornerDownLeft size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
