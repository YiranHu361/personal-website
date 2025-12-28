'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef } from 'react'

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  variant?: 'light' | 'dark'
}

export default function MagneticButton({ label, variant = 'light', className = '', ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18 })
  const springY = useSpring(y, { stiffness: 200, damping: 18 })

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const offsetX = event.clientX - rect.left - rect.width / 2
    const offsetY = event.clientY - rect.top - rect.height / 2
    x.set(offsetX * 0.2)
    y.set(offsetY * 0.2)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const baseClasses = 'relative border border-[#111] px-5 py-3 text-xs uppercase tracking-[0.3em] hard-shadow-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4cc9f0]'

  const variantClasses = variant === 'dark'
    ? 'bg-[#111] text-[#f8f9fa] hover:bg-[#f8f9fa] hover:text-[#111]'
    : 'bg-white text-[#111] hover:bg-[#111] hover:text-[#f8f9fa]'

  return (
    <motion.button
      ref={ref}
      type="button"
      data-cursor="hover"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {label ?? props.children}
    </motion.button>
  )
}
