import { type NextRequest, NextResponse } from "next/server"

// Mock user data - In production, this would come from database
const mockUsers = [
  {
    id: "1",
    username: "demo",
    email: "demo@eurotel.com",
    firstName: "Demo",
    lastName: "User",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    preferences: {
      roomType: "suite",
      smokingPreference: "non-smoking",
      bedType: "king",
      floorPreference: "high",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    username: "admin",
    email: "admin@eurotel.com",
    firstName: "Admin",
    lastName: "User",
    phone: "+1 (555) 987-6543",
    address: "456 Admin Ave, City, State 12345",
    preferences: {
      roomType: "double",
      smokingPreference: "non-smoking",
      bedType: "queen",
      floorPreference: "any",
    },
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    // Find user (in production, query database)
    const user = mockUsers.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive information
    const { ...userProfile } = user

    return NextResponse.json({
      success: true,
      user: userProfile,
    })
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const updateData = await request.json()

    // Find user index (in production, query database)
    const userIndex = mockUsers.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user data (in production, update database)
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }

    // Remove sensitive information from response
    const { ...updatedUser } = mockUsers[userIndex]

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Update user profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const authHeader = request.headers.get('authorization')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader || '',
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch user' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
