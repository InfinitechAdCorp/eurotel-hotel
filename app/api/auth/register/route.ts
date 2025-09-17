import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (process.env.NEXT_PUBLIC_API_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: data.message || "Registration failed" }, { status: response.status })
      }

      return NextResponse.json(data)
    }

    // Fallback mock registration for development
    const mockUsers: any[] = []

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.username === username || u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "Username or email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      username,
      email,
      password,
    }

    mockUsers.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Registration successful",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
