'use client'

import { useState, useEffect, useCallback } from 'react'

const words = ['things', 'apps', 'websites', 'experiences', 'interfaces']
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export default function ScrambleText() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState(words[0])
  const [isScrambling, setIsScrambling] = useState(false)

  const scrambleToWord = useCallback((targetWord: string) => {
    setIsScrambling(true)
    const duration = 500 // 0.5 seconds
    const frameRate = 30 // updates per second
    const totalFrames = (duration / 1000) * frameRate
    let frame = 0

    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames

      // Generate scrambled text that matches target length
      let scrambled = ''
      for (let i = 0; i < targetWord.length; i++) {
        // As progress increases, more letters settle into their final position
        if (Math.random() < progress * progress) {
          scrambled += targetWord[i]
        } else {
          scrambled += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      setDisplayText(scrambled)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayText(targetWord)
        setIsScrambling(false)
      }
    }, 1000 / frameRate)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cycleWords = setInterval(() => {
      const nextIndex = (currentIndex + 1) % words.length
      setCurrentIndex(nextIndex)
      scrambleToWord(words[nextIndex])
    }, 5000) // Switch every 5 seconds

    return () => clearInterval(cycleWords)
  }, [currentIndex, scrambleToWord])

  return (
    <div className="mt-4 space-y-1">
      <p className="text-sm leading-relaxed">
        I{' '}
        <span
          className="italic"
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontStyle: 'italic',
            letterSpacing: '0.02em'
          }}
        >
          design
        </span>
        {' '}and{' '}
        <span
          className="font-bold"
          style={{
            fontFamily: '"Space Mono", monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '0.85em'
          }}
        >
          develop
        </span>
        {' '}
        <span
          className={`inline-block min-w-[100px] ${isScrambling ? 'text-[#7209b7]' : 'text-[#4cc9f0]'}`}
          style={{
            fontFamily: '"Space Mono", monospace',
            transition: 'color 0.3s ease'
          }}
        >
          {displayText}
        </span>
        .
      </p>
      <p className="text-sm leading-relaxed">
        Cofounder @{' '}
        <a
          href="https://ambees.io"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:underline"
          style={{
            fontFamily: '"Space Mono", monospace',
            letterSpacing: '0.05em',
            color: '#f5c842'
          }}
        >
          Ambees.io
        </a>
      </p>
    </div>
  )
}
