'use client'

import { motion } from 'framer-motion'
import { CornerDownLeft, Maximize2, Minimize2 } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'

interface TerminalMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface TerminalProps {
  ownerName: string
  nestRef?: React.RefObject<HTMLDivElement>
}

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

  // Check if terminal is near the nest to snap back
  const checkDockProximity = useCallback(() => {
    if (!nestRef?.current || !terminalRef.current) return

    const nestRect = nestRef.current.getBoundingClientRect()
    const terminalRect = terminalRef.current.getBoundingClientRect()

    // Check if terminal center is within 100px of nest center
    const nestCenterX = nestRect.left + nestRect.width / 2
    const nestCenterY = nestRect.top + nestRect.height / 2
    const terminalCenterX = terminalRect.left + terminalRect.width / 2
    const terminalCenterY = terminalRect.top + terminalRect.height / 2

    const distance = Math.sqrt(
      Math.pow(nestCenterX - terminalCenterX, 2) +
      Math.pow(nestCenterY - terminalCenterY, 2)
    )

    if (distance < 100) {
      setIsDocked(true)
      setPosition({ x: 0, y: 0 })
    }
  }, [nestRef])

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: TerminalMessage = {
      id: `user-${Date.now()}`,
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
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply ?? 'No response received.',
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
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
    // Position at bottom right when undocked
    setPosition({ x: window.innerWidth - 340, y: window.innerHeight - 320 })
  }

  const handleDock = () => {
    setIsDocked(true)
    setPosition({ x: 0, y: 0 })
  }

  // If docked, render in the nest position
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
        <div className="max-h-48 space-y-3 overflow-y-auto px-4 py-3 text-xs">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#7209b7]">
                {message.role === 'assistant' ? 'system.ai' : message.role}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
          {isLoading && <div className="text-[10px] uppercase tracking-[0.3em]">Querying...</div>}
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
      <div className="max-h-56 space-y-3 overflow-y-auto px-4 py-3 text-xs">
        {messages.map((message) => (
          <div key={message.id} className="space-y-1">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#7209b7]">
              {message.role === 'assistant' ? 'system.ai' : message.role}
            </div>
            <div>{message.content}</div>
          </div>
        ))}
        {isLoading && <div className="text-[10px] uppercase tracking-[0.3em]">Querying...</div>}
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
