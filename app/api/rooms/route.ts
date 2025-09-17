import { type NextRequest, NextResponse } from "next/server"

// Mock room data - In production, this would come from a database
const mockRooms = [
  {
    id: "1",
    name: "Deluxe Single Room",
    type: "single",
    price: 150,
    description: "Perfect for solo travelers, featuring a comfortable queen bed and modern amenities.",
    amenities: ["Free WiFi", "Air Conditioning", "Mini Bar", "Room Service", "Flat Screen TV"],
    image: "/placeholder.svg?height=300&width=400&text=Deluxe+Single+Room",
    available: true,
  },
  {
    id: "2",
    name: "Superior Single Room",
    type: "single",
    price: 120,
    description: "Cozy single room with all essential amenities for a comfortable stay.",
    amenities: ["Free WiFi", "Air Conditioning", "Room Service", "Flat Screen TV"],
    image: "/placeholder.svg?height=300&width=400&text=Superior+Single+Room",
    available: true,
  },
  {
    id: "3",
    name: "Standard Double Room",
    type: "double",
    price: 200,
    description: "Spacious double room perfect for couples with a king-size bed and city views.",
    amenities: ["Free WiFi", "Air Conditioning", "Mini Bar", "Room Service", "Flat Screen TV", "City View"],
    image: "/placeholder.svg?height=300&width=400&text=Standard+Double+Room",
    available: true,
  },
  {
    id: "4",
    name: "Deluxe Double Room",
    type: "double",
    price: 250,
    description: "Luxurious double room with premium amenities and stunning city panorama.",
    amenities: ["Free WiFi", "Air Conditioning", "Mini Bar", "Room Service", "Flat Screen TV", "City View", "Balcony"],
    image: "/placeholder.svg?height=300&width=400&text=Deluxe+Double+Room",
    available: false,
  },
  {
    id: "5",
    name: "Executive Suite",
    type: "suite",
    price: 400,
    description: "Spacious suite with separate living area, perfect for business travelers and extended stays.",
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Mini Bar",
      "Room Service",
      "Flat Screen TV",
      "City View",
      "Balcony",
      "Work Desk",
      "Sofa",
    ],
    image: "/placeholder.svg?height=300&width=400&text=Executive+Suite",
    available: true,
  },
  {
    id: "6",
    name: "Presidential Suite",
    type: "suite",
    price: 600,
    description: "The ultimate luxury experience with premium amenities and personalized service.",
    amenities: [
      "Free WiFi",
      "Air Conditioning",
      "Mini Bar",
      "Room Service",
      "Flat Screen TV",
      "City View",
      "Balcony",
      "Work Desk",
      "Sofa",
      "Jacuzzi",
      "Butler Service",
    ],
    image: "/placeholder.svg?height=300&width=400&text=Presidential+Suite",
    available: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const available = searchParams.get("available")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")

    let filteredRooms = mockRooms

    // Filter by type
    if (type && type !== "all") {
      filteredRooms = filteredRooms.filter((room) => room.type === type)
    }

    // Filter by availability
    if (available === "true") {
      filteredRooms = filteredRooms.filter((room) => room.available)
    }

    // Filter by price range
    if (minPrice) {
      filteredRooms = filteredRooms.filter((room) => room.price >= Number.parseInt(minPrice))
    }
    if (maxPrice) {
      filteredRooms = filteredRooms.filter((room) => room.price <= Number.parseInt(maxPrice))
    }

    return NextResponse.json({
      success: true,
      rooms: filteredRooms,
      total: filteredRooms.length,
    })
  } catch (error) {
    console.error("Rooms API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch rooms' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Rooms API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
