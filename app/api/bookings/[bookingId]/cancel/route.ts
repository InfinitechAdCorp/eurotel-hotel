import { type NextRequest, NextResponse } from "next/server"

// Mock booking storage - In production, this would be a database
const mockBookings: any[] = []

export async function POST(request: NextRequest, { params }: { params: { bookingId: string } }) {
  try {
    const { bookingId } = params
    const { reason } = await request.json()

    // Find booking (in production, query database)
    const bookingIndex = mockBookings.findIndex((booking) => booking.id === bookingId)

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const booking = mockBookings[bookingIndex]

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Booking is already cancelled" }, { status: 400 })
    }

    if (booking.status === "checked-out") {
      return NextResponse.json({ error: "Cannot cancel a completed booking" }, { status: 400 })
    }

    // Check cancellation policy (24 hours before check-in)
    const checkInDate = new Date(booking.checkInDate)
    const now = new Date()
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    let cancellationFee = 0
    if (hoursUntilCheckIn < 24) {
      // Apply cancellation fee for late cancellations
      cancellationFee = booking.totalAmount * 0.1 // 10% fee
    }

    // Update booking status
    mockBookings[bookingIndex] = {
      ...booking,
      status: "cancelled",
      cancellationDate: new Date().toISOString(),
      cancellationReason: reason || "No reason provided",
      cancellationFee,
      refundAmount: booking.totalAmount - cancellationFee,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
      booking: mockBookings[bookingIndex],
      cancellationFee,
      refundAmount: booking.totalAmount - cancellationFee,
    })
  } catch (error) {
    console.error("Cancel booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params
    const cancellationData = await request.json()
    const authHeader = request.headers.get('authorization')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeader || '',
      },
      body: JSON.stringify(cancellationData),
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Cancellation failed' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Cancel booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
