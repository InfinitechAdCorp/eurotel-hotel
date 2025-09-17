import { type NextRequest, NextResponse } from "next/server"

// Mock testimonials data - In production, this would come from database
const mockTestimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    comment: "Exceptional service and beautiful rooms. The staff went above and beyond to make our stay memorable.",
    bookingId: "BK123456",
    roomType: "suite",
    stayDate: "2024-01-15",
    verified: true,
    featured: true,
    createdAt: "2024-01-16T10:00:00Z",
  },
  {
    id: "2",
    name: "Michael Chen",
    location: "Toronto, Canada",
    rating: 5,
    comment:
      "Perfect location and amazing amenities. The pool area is stunning and the restaurant food is outstanding.",
    bookingId: "BK123457",
    roomType: "double",
    stayDate: "2024-01-10",
    verified: true,
    featured: true,
    createdAt: "2024-01-11T14:30:00Z",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    comment:
      "Clean, comfortable, and luxurious. Eurotel truly lives up to its promise of where service and comfort meet.",
    bookingId: "BK123458",
    roomType: "single",
    stayDate: "2024-01-05",
    verified: true,
    featured: true,
    createdAt: "2024-01-06T09:15:00Z",
  },
  {
    id: "4",
    name: "David Wilson",
    location: "London, UK",
    rating: 4,
    comment: "Great hotel with excellent facilities. The business center was perfect for my work needs.",
    bookingId: "BK123459",
    roomType: "suite",
    stayDate: "2023-12-20",
    verified: true,
    featured: false,
    createdAt: "2023-12-21T16:45:00Z",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    location: "Sydney, Australia",
    rating: 5,
    comment: "Absolutely wonderful experience! The spa treatments were incredible and the staff was so friendly.",
    bookingId: "BK123460",
    roomType: "double",
    stayDate: "2023-12-15",
    verified: true,
    featured: false,
    createdAt: "2023-12-16T11:20:00Z",
  },
  {
    id: "6",
    name: "James Thompson",
    location: "Chicago, USA",
    rating: 4,
    comment: "Very comfortable stay with great amenities. The room service was prompt and the food was delicious.",
    bookingId: "BK123461",
    roomType: "single",
    stayDate: "2023-12-10",
    verified: true,
    featured: false,
    createdAt: "2023-12-11T13:10:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get("featured")
    const minRating = searchParams.get("minRating")
    const roomType = searchParams.get("roomType")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredTestimonials = mockTestimonials

    // Filter by featured status
    if (featured === "true") {
      filteredTestimonials = filteredTestimonials.filter((t) => t.featured)
    }

    // Filter by minimum rating
    if (minRating) {
      filteredTestimonials = filteredTestimonials.filter((t) => t.rating >= Number.parseInt(minRating))
    }

    // Filter by room type
    if (roomType) {
      filteredTestimonials = filteredTestimonials.filter((t) => t.roomType === roomType)
    }

    // Sort by creation date (newest first)
    filteredTestimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Pagination
    const paginatedTestimonials = filteredTestimonials.slice(offset, offset + limit)

    // Calculate average rating
    const averageRating =
      filteredTestimonials.length > 0
        ? filteredTestimonials.reduce((sum, t) => sum + t.rating, 0) / filteredTestimonials.length
        : 0

    return NextResponse.json({
      success: true,
      testimonials: paginatedTestimonials,
      total: filteredTestimonials.length,
      averageRating: Math.round(averageRating * 10) / 10,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get testimonials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, location, rating, comment, bookingId, roomType } = await request.json()

    // Basic validation
    if (!name || !rating || !comment) {
      return NextResponse.json(
        {
          error: "Name, rating, and comment are required",
        },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          error: "Rating must be between 1 and 5",
        },
        { status: 400 },
      )
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        {
          error: "Comment must be at least 10 characters long",
        },
        { status: 400 },
      )
    }

    // Create new testimonial
    const testimonial = {
      id: `T${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      name: name.trim(),
      location: location?.trim() || "Unknown",
      rating,
      comment: comment.trim(),
      bookingId: bookingId || null,
      roomType: roomType || "unknown",
      stayDate: new Date().toISOString().split("T")[0],
      verified: !!bookingId, // Verified if booking ID provided
      featured: false, // Admin can mark as featured later
      createdAt: new Date().toISOString(),
    }

    // Store testimonial (in production, save to database)
    mockTestimonials.push(testimonial)

    return NextResponse.json({
      success: true,
      testimonial,
      message: "Thank you for your testimonial!",
    })
  } catch (error) {
    console.error("Create testimonial error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const endpoint = queryString ? `/api/testimonials?${queryString}` : '/api/testimonials'
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch testimonials' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get testimonials error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
