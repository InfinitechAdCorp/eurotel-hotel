import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    console.log("[v0] Login attempt:", { username, password })

    // Basic validation
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (process.env.NEXT_PUBLIC_API_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: data.message || "Login failed" }, { status: response.status })
      }

      return NextResponse.json(data)
    }

    // Fallback mock authentication for development
    const mockUsers = [
      {
        id: "1",
        username: "demo",
        password: "password123",
        email: "demo@eurotel.com",
      },
      {
        id: "2",
        username: "admin",
        password: "admin123",
        email: "admin@eurotel.com",
      },
    ]

    const user = mockUsers.find((u) => u.username === username && u.password === password)

    console.log("[v0] User found:", user ? "Yes" : "No")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user

    console.log("[v0] Login successful for user:", userWithoutPassword)

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
