import { type NextRequest, NextResponse } from "next/server"

// Mock user database - In production, this would be replaced with actual database calls
const mockUsers = [
  {
    id: "1",
    username: "demo",
    password: "password123", // In production, this would be hashed
    email: "demo@eurotel.com",
  },
  {
    id: "2",
    username: "admin",
    password: "admin123",
    email: "admin@eurotel.com",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Basic validation
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // In production, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Use environment variables for API calls to Laravel backend
    // 3. Implement proper session management

    // Mock authentication - replace with actual Laravel API call
    const user = mockUsers.find((u) => u.username === username && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Login failed' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
