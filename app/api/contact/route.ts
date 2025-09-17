import { type NextRequest, NextResponse } from "next/server"

// Mock contact submissions storage - In production, this would be a database
const mockContactSubmissions: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: "Please provide a valid email address",
        },
        { status: 400 },
      )
    }

    // Create contact submission
    const submission = {
      id: `CS${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name,
      email,
      subject,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store submission (in production, save to database)
    mockContactSubmissions.push(submission)

    // In production, you might also:
    // 1. Send email notification to hotel staff
    // 2. Send confirmation email to customer
    // 3. Create ticket in support system

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      message: "Thank you for contacting us. We'll get back to you soon!",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // This would typically be admin-only endpoint
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredSubmissions = mockContactSubmissions

    if (status) {
      filteredSubmissions = filteredSubmissions.filter((sub) => sub.status === status)
    }

    // Pagination
    const paginatedSubmissions = filteredSubmissions.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      submissions: paginatedSubmissions,
      total: filteredSubmissions.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get contact submissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(contactData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to submit contact form' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
