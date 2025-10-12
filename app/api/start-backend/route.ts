import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    // Get backend URL from environment or default to Railway backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://wordle-backend-production-b789.up.railway.app'
    
    // Check if backend is already running
    const healthCheck = await fetch(`${backendUrl}/api/wordle/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    }).catch(() => null)

    if (healthCheck?.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Backend is already running',
        status: 'running'
      })
    }

    // Start the backend process
    const backendPath = path.join(process.cwd(), 'wordle-backend')
    const child = spawn('mvn', ['spring-boot:run'], {
      cwd: backendPath,
      detached: true,
      stdio: 'ignore'
    })

    // Detach the process so it continues running
    child.unref()

    return NextResponse.json({ 
      success: true, 
      message: 'Backend starting...',
      status: 'starting',
      pid: child.pid
    })

  } catch (error) {
    console.error('Error starting backend:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to start backend',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get backend URL from environment or default to Railway backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://wordle-backend-production-b789.up.railway.app'
    
    // Check backend health
    const response = await fetch(`${backendUrl}/api/wordle/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    })

    return NextResponse.json({ 
      success: response.ok,
      status: response.ok ? 'running' : 'stopped',
      message: response.ok ? 'Backend is running' : 'Backend is not running'
    })

  } catch (error) {
    return NextResponse.json({ 
      success: false,
      status: 'stopped',
      message: 'Backend is not running'
    })
  }
}
