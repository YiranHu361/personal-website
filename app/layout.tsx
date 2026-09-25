import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Yiran Hu - Personal Website',
  description: 'Yiran Hu is a UC Berkeley Math & CS student, Co-Founder & CTO of Ambees, and researcher working on LLM tutors, stochastic games, and AI policy.',
  keywords: ['Yiran Hu', 'UC Berkeley', 'mathematics', 'computer science', 'Ambees', 'AI', 'LLM tutors', 'research', 'portfolio'],
  authors: [{ name: 'Yiran Hu' }],
  openGraph: {
    title: 'Yiran Hu - Personal Website',
    description: 'UC Berkeley Math & CS student, Co-Founder & CTO of Ambees, and researcher working on LLM tutors, stochastic games, and AI policy.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceMono.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
