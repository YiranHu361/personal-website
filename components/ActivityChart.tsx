'use client'

import { motion } from 'framer-motion'

export interface ActivityPoint {
  day: string
  value: number
}

interface ActivityChartProps {
  data: ActivityPoint[]
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const width = 480
  const height = 180
  const padding = 16
  const maxValue = Math.max(...data.map((point) => point.value), 1)

  const step = (width - padding * 2) / (data.length - 1)
  const points = data.map((point, index) => {
    const x = padding + index * step
    const y = height - padding - (point.value / maxValue) * (height - padding * 2)
    return { x, y }
  })

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaPath = `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.3em]">
        <span>Neural Activity</span>
        <span className="text-[#7209b7]">Last 7 Cycles</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
        <defs>
          <linearGradient id="activityGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4cc9f0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4cc9f0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#activityGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#111"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        />
        {points.map((point, index) => (
          <circle key={data[index].day} cx={point.x} cy={point.y} r="3" fill="#7209b7" />
        ))}
      </svg>
      <div className="mt-4 grid grid-cols-7 gap-2 text-[10px] uppercase tracking-[0.3em]">
        {data.map((point) => (
          <div key={point.day} className="text-center text-[#111]">
            {point.day}
          </div>
        ))}
      </div>
    </div>
  )
}
