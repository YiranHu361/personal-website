import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Yiran Hu - Personal Website',
  description: 'Personal website showcasing projects, skills, and experience',
  keywords: ['portfolio', 'developer', 'designer', 'personal website'],
  authors: [{ name: 'Yiran Hu' }],
  openGraph: {
    title: 'Yiran Hu - Personal Website',
    description: 'Personal website showcasing projects, skills, and experience',
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
