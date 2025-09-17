import { type NextRequest, NextResponse } from "next/server"

// Mock booking storage - In production, this would be a database
const mockBookings: any[] = []

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()

    // Basic validation
    if (!bookingData.roomId || !bookingData.userId || !bookingData.checkInDate || !bookingData.checkOutDate) {
      return NextResponse.json({ error: "Missing required booking information" }, { status: 400 })
    }

    // Validate dates
    const checkIn = new Date(bookingData.checkInDate)
    const checkOut = new Date(bookingData.checkOutDate)

    if (checkIn >= checkOut) {
      return NextResponse.json({ error: "Check-out date must be after check-in date" }, { status: 400 })
    }

    if (checkIn < new Date()) {
      return NextResponse.json({ error: "Check-in date cannot be in the past" }, { status: 400 })
    }

    // Generate booking ID
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create booking record
    const booking = {
      id: bookingId,
      ...bookingData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Store booking (in production, save to database)
    mockBookings.push(booking)

    return NextResponse.json({
      success: true,
      bookingId,
      booking,
      message: "Booking confirmed successfully",
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const bookingId = searchParams.get("bookingId")

    let filteredBookings = mockBookings

    if (userId) {
      filteredBookings = filteredBookings.filter((booking) => booking.userId === userId)
    }

    if (bookingId) {
      filteredBookings = filteredBookings.filter((booking) => booking.id === bookingId)
    }

    return NextResponse.json({
      success: true,
      bookings: filteredBookings,
      total: filteredBookings.length,
    })
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${bookingData.token}`, // if using auth tokens
      },
      body: JSON.stringify(bookingData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Booking failed' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
