import { type NextRequest, NextResponse } from "next/server"

// Mock feedback storage - In production, this would be a database
const mockFeedback: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { bookingId, rating, feedback, category } = await request.json()

    // Basic validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          error: "Rating must be between 1 and 5",
        },
        { status: 400 },
      )
    }

    if (!feedback || feedback.trim().length < 10) {
      return NextResponse.json(
        {
          error: "Feedback must be at least 10 characters long",
        },
        { status: 400 },
      )
    }

    // Create feedback entry
    const feedbackEntry = {
      id: `FB${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      bookingId: bookingId || null,
      rating,
      feedback: feedback.trim(),
      category: category || "general",
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store feedback (in production, save to database)
    mockFeedback.push(feedbackEntry)

    return NextResponse.json({
      success: true,
      feedbackId: feedbackEntry.id,
      message: "Thank you for your feedback!",
    })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const minRating = searchParams.get("minRating")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredFeedback = mockFeedback

    if (category) {
      filteredFeedback = filteredFeedback.filter((fb) => fb.category === category)
    }

    if (minRating) {
      filteredFeedback = filteredFeedback.filter((fb) => fb.rating >= Number.parseInt(minRating))
    }

    // Sort by creation date (newest first)
    filteredFeedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const paginatedFeedback = filteredFeedback.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      feedback: paginatedFeedback,
      total: filteredFeedback.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get feedback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function POST(request: NextRequest) {
  try {
    const feedbackData = await request.json()
    const authHeader = request.headers.get('authorization')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(feedbackData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to submit feedback' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Feedback submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
