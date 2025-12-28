'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState, useRef, useCallback } from 'react'

const CURSOR_SIZES = {
  default: { width: 6, height: 6 },
  hover: { width: 56, height: 56 },
  text: { width: 3, height: 26 },
  drag: { width: 28, height: 28 },
}

type CursorVariant = keyof typeof CURSOR_SIZES

interface InkPoint {
  x: number
  y: number
}

interface InkStroke {
  id: number
  points: InkPoint[]
  color: string
  opacity: number
}

const INK_COLORS = [
  '#7209b7', // Purple
  '#4cc9f0', // Cyan
  '#f72585', // Pink
  '#4361ee', // Blue
  '#3a0ca3', // Deep purple
  '#560bad', // Violet
  '#480ca8', // Indigo
]

// Generate smooth SVG path using Catmull-Rom spline for fountain pen effect
function getSmoothPath(points: InkPoint[]): string {
  if (points.length < 2) return ''
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`

  // Use quadratic bezier curves for smooth interpolation
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const next = points[i + 1]

    // Calculate control point for smooth curve
    const cpX = curr.x
    const cpY = curr.y

    // Midpoint to next point
    const midX = (curr.x + next.x) / 2
    const midY = (curr.y + next.y) / 2

    path += ` Q ${cpX} ${cpY} ${midX} ${midY}`
  }

  // Connect to the last point
  const lastPoint = points[points.length - 1]
  path += ` L ${lastPoint.x} ${lastPoint.y}`

  return path
}

export default function Cursor() {
  const [variant, setVariant] = useState<CursorVariant>('default')
  const [enabled, setEnabled] = useState(true)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<InkStroke[]>([])
  const currentStrokeRef = useRef<InkStroke | null>(null)
  const strokeIdRef = useRef(0)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 600, damping: 35 })
  const springY = useSpring(y, { stiffness: 600, damping: 35 })

  // Get a random ink color
  const getRandomColor = useCallback(() => {
    return INK_COLORS[Math.floor(Math.random() * INK_COLORS.length)]
  }, [])

  // Check if clicking on empty space (not on interactive elements)
  const isEmptySpace = useCallback((target: HTMLElement | null): boolean => {
    if (!target) return false

    const interactiveSelectors = [
      'button', 'a', 'input', 'textarea', 'select',
      '[data-cursor]', '[role="button"]', '.hard-shadow',
      'img', 'video', 'iframe'
    ]

    for (const selector of interactiveSelectors) {
      if (target.matches(selector) || target.closest(selector)) {
        return false
      }
    }

    return true
  }, [])

  // Fade out strokes smoothly
  useEffect(() => {
    if (strokes.length === 0) return

    const fadeInterval = setInterval(() => {
      setStrokes(prev => {
        const updated = prev
          .map(stroke => ({
            ...stroke,
            opacity: stroke.opacity - 0.02
          }))
          .filter(stroke => stroke.opacity > 0)
        return updated
      })
    }, 30)

    return () => clearInterval(fadeInterval)
  }, [strokes.length > 0])

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    setEnabled(media.matches)
    const handler = (event: MediaQueryListEvent) => setEnabled(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleMove = (event: MouseEvent) => {
      const { width, height } = CURSOR_SIZES[variant]
      x.set(event.clientX - width / 2)
      y.set(event.clientY - height / 2)

      // Add points to current stroke while drawing
      if (isDrawing && currentStrokeRef.current) {
        const currentX = event.clientX
        const currentY = event.clientY
        const points = currentStrokeRef.current.points
        const lastPoint = points[points.length - 1]

        // Only add point if moved enough distance (for performance)
        if (!lastPoint ||
            Math.abs(currentX - lastPoint.x) > 2 ||
            Math.abs(currentY - lastPoint.y) > 2) {

          currentStrokeRef.current.points.push({ x: currentX, y: currentY })

          // Update strokes state to trigger re-render
          setStrokes(prev => {
            const existing = prev.find(s => s.id === currentStrokeRef.current?.id)
            if (existing) {
              return prev.map(s =>
                s.id === currentStrokeRef.current?.id
                  ? { ...s, points: [...currentStrokeRef.current!.points] }
                  : s
              )
            }
            return prev
          })
        }
      }
    }

    const handleOver = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const cursorType = target.closest('[data-cursor]')?.getAttribute('data-cursor')
      if (cursorType === 'text' || cursorType === 'hover' || cursorType === 'drag') {
        setVariant(cursorType)
        return
      }
      setVariant('default')
    }

    const handleDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null

      if (target?.closest('[data-cursor="drag"]')) {
        setVariant('drag')
        return
      }

      // Start drawing if clicking on empty space
      if (isEmptySpace(target)) {
        const newStroke: InkStroke = {
          id: strokeIdRef.current++,
          points: [{ x: event.clientX, y: event.clientY }],
          color: getRandomColor(),
          opacity: 1
        }

        currentStrokeRef.current = newStroke
        setStrokes(prev => [...prev, newStroke])
        setIsDrawing(true)
      }
    }

    const handleUp = () => {
      setVariant('default')
      setIsDrawing(false)
      currentStrokeRef.current = null
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('pointerover', handleOver)
    window.addEventListener('pointerdown', handleDown)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointerleave', handleUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('pointerover', handleOver)
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointerleave', handleUp)
    }
  }, [enabled, variant, x, y, isDrawing, isEmptySpace, getRandomColor])

  if (!enabled) {
    return null
  }

  const size = CURSOR_SIZES[variant]
  const isHover = variant === 'hover'
  const isText = variant === 'text'
  const isDrag = variant === 'drag'

  return (
    <>
      {/* Ink stroke canvas - fountain pen style */}
      <svg
        className="pointer-events-none fixed inset-0 z-40"
        style={{ width: '100vw', height: '100vh' }}
      >
        {strokes.map((stroke) => (
          <path
            key={stroke.id}
            d={getSmoothPath(stroke.points)}
            fill="none"
            stroke={stroke.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={stroke.opacity}
            style={{
              transition: 'opacity 0.1s ease-out',
            }}
          />
        ))}
      </svg>

      {/* Main cursor */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50"
        style={{
          x: springX,
          y: springY,
          width: size.width,
          height: size.height,
          borderRadius: isHover ? '999px' : '0px',
          backgroundColor: isText || isDrag ? 'transparent' : isHover ? 'rgba(33, 37, 41, 0.08)' : '#111',
          border: isText ? '1px solid #111' : isDrag ? '2px dashed #111' : '1px solid #111',
          mixBlendMode: isHover ? 'multiply' : 'normal',
        }}
      />
    </>
  )
}
