'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, RotateCcw, Info, Server, AlertCircle } from 'lucide-react'

interface WordleResponse {
  suggestions: string[]
  message: string
  success: boolean
}

const WordleSolver = () => {
  const [word, setWord] = useState('')
  const [hints, setHints] = useState('')
  const [result, setResult] = useState<WordleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backendStatus, setBackendStatus] = useState<'checking' | 'running' | 'starting' | 'error'>('checking')
  const [startupAttempts, setStartupAttempts] = useState(0)

  // Get backend URL from environment or default to localhost
  const getBackendUrl = () => {
    // Use Next.js API proxy to avoid CORS issues
    return '/api/wordle-proxy'
  }

  // Check backend health via API
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(getBackendUrl(), {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      })
      const data = await response.json()
      return data.success
    } catch (error) {
      return false
    }
  }

  // Start backend process via API
  const startBackend = async () => {
    if (startupAttempts >= 3) {
      setBackendStatus('error')
      return
    }

    setBackendStatus('starting')
    setStartupAttempts(prev => prev + 1)

    try {
      // Check if Railway backend is available
      const isHealthy = await checkBackendHealth()
      if (isHealthy) {
        setBackendStatus('running')
        setError('')
      } else {
        setBackendStatus('error')
        setError('Railway backend is not responding. Please try again later.')
      }
    } catch (err) {
      setBackendStatus('error')
      setError('Failed to connect to Railway backend.')
    }
  }

  // Check backend status on component mount
  useEffect(() => {
    const checkStatus = async () => {
      const isHealthy = await checkBackendHealth()
      if (isHealthy) {
        setBackendStatus('running')
        setError('')
      } else {
        setBackendStatus('error')
        setError('Railway backend is not responding. Please try again later.')
      }
    }
    
    checkStatus()
  }, [])

  const solveWordle = async () => {
    if (!word || word.length !== 5) {
      setError('Word must be exactly 5 letters')
      return
    }

    if (!hints || hints.split(' ').length !== 5) {
      setError('Hints must be in format: "x x x x x" (5 characters with spaces)')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(getBackendUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, hints }),
      })

      if (!response.ok) {
        throw new Error('Failed to solve Wordle')
      }

      const data: WordleResponse = await response.json()
      setResult(data)
    } catch (err) {
      setError('Error connecting to solver. Make sure the backend is running on port 8080.')
      console.error('Error solving Wordle:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setWord('')
    setHints('')
    setResult(null)
    setError('')
  }

  const getHintExample = () => {
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Info size={16} className="text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">Hint Format Guide</span>
        </div>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>-</strong> = Grey (letter not in word)</p>
          <p><strong>x</strong> = Yellow (letter in word, wrong position)</p>
          <p><strong>letter</strong> = Green (correct letter in correct position)</p>
          <p className="mt-2"><strong>Example:</strong> For "hello" with hints "- e - - x", enter: <code className="bg-blue-100 px-1 rounded">- e - - x</code></p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Backend Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
            backendStatus === 'running' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-300'
              : backendStatus === 'starting'
              ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300'
              : backendStatus === 'error'
              ? 'bg-red-500/20 border border-red-500/30 text-red-300'
              : 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
          }`}>
            <Server size={16} />
            <span className="text-sm font-medium">
              {backendStatus === 'running' && 'Backend Running'}
              {backendStatus === 'starting' && 'Starting Backend...'}
              {backendStatus === 'checking' && 'Checking Backend...'}
              {backendStatus === 'error' && 'Backend Unavailable'}
            </span>
            {backendStatus === 'starting' && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Wordle <span className="gradient-text">Solver</span>
          </h1>
          <p className="text-xl text-gray-300">
            Intelligent Wordle solver built with Java and Spring Boot
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect p-8 rounded-xl"
        >
          <div className="space-y-6">
            {/* Word Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Enter your word (5 letters)
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value.toLowerCase().slice(0, 5))}
                placeholder="e.g., soare"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                maxLength={5}
              />
            </div>

            {/* Hints Input */}
            <div>
              <label className="block text-white font-medium mb-2">
                Enter hints (separated by spaces)
              </label>
              <input
                type="text"
                value={hints}
                onChange={(e) => setHints(e.target.value)}
                placeholder="e.g., - e - - x"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Hint Guide */}
            {getHintExample()}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                onClick={solveWordle}
                disabled={loading || !word || !hints}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Solving...
                  </>
                ) : (
                  <>
                    <Search size={20} className="mr-2" />
                    Solve Wordle
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={resetForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center justify-center"
              >
                <RotateCcw size={20} className="mr-2" />
                Reset
              </motion.button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-primary-500/20 border border-primary-500/30 rounded-lg"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  {result.success ? 'Suggestions' : 'Result'}
                </h3>
                
                <p className="text-primary-300 mb-4">{result.message}</p>

                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <p className="text-white font-medium mb-3">
                      Top {result.suggestions.length} suggestions:
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {result.suggestions.map((suggestion, index) => (
                        <motion.span
                          key={suggestion}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="px-3 py-2 bg-white/10 text-white rounded-lg text-center font-mono text-sm hover:bg-white/20 transition-colors duration-200"
                        >
                          {suggestion}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="glass-effect p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-3">How to Use</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <p>1. Enter a 5-letter word you tried in Wordle</p>
              <p>2. Enter the hints using the format above</p>
              <p>3. Click "Solve Wordle" to get suggestions</p>
              <p>4. Repeat with your next guess</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default WordleSolver
