import { type NextRequest, NextResponse } from "next/server"

// Mock amenities data - In production, this would come from database
const mockAmenities = [
  {
    id: "1",
    name: "Free WiFi",
    description: "High-speed internet throughout the hotel",
    category: "connectivity",
    icon: "wifi",
    available: true,
    featured: true,
  },
  {
    id: "2",
    name: "Free Parking",
    description: "Complimentary valet parking service",
    category: "parking",
    icon: "car",
    available: true,
    featured: true,
  },
  {
    id: "3",
    name: "24/7 Room Service",
    description: "Round-the-clock dining at your convenience",
    category: "dining",
    icon: "room-service",
    available: true,
    featured: true,
  },
  {
    id: "4",
    name: "Fine Dining Restaurant",
    description: "Award-winning restaurant with international cuisine",
    category: "dining",
    icon: "restaurant",
    available: true,
    featured: true,
  },
  {
    id: "5",
    name: "Fitness Center",
    description: "State-of-the-art gym equipment",
    category: "fitness",
    icon: "gym",
    available: true,
    featured: true,
  },
  {
    id: "6",
    name: "Swimming Pool",
    description: "Outdoor pool with city views",
    category: "recreation",
    icon: "pool",
    available: true,
    featured: true,
  },
  {
    id: "7",
    name: "Spa & Wellness Center",
    description: "Full-service spa with massage and treatments",
    category: "wellness",
    icon: "spa",
    available: true,
    featured: false,
  },
  {
    id: "8",
    name: "Business Center",
    description: "Meeting rooms and business facilities",
    category: "business",
    icon: "business",
    available: true,
    featured: false,
  },
  {
    id: "9",
    name: "Concierge Service",
    description: "24/7 concierge assistance",
    category: "service",
    icon: "concierge",
    available: true,
    featured: false,
  },
  {
    id: "10",
    name: "Laundry Service",
    description: "Same-day laundry and dry cleaning",
    category: "service",
    icon: "laundry",
    available: true,
    featured: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const available = searchParams.get("available")

    let filteredAmenities = mockAmenities

    // Filter by category
    if (category) {
      filteredAmenities = filteredAmenities.filter((amenity) => amenity.category === category)
    }

    // Filter by featured status
    if (featured === "true") {
      filteredAmenities = filteredAmenities.filter((amenity) => amenity.featured)
    }

    // Filter by availability
    if (available === "true") {
      filteredAmenities = filteredAmenities.filter((amenity) => amenity.available)
    }

    // Group by category for easier frontend consumption
    const groupedAmenities = filteredAmenities.reduce(
      (acc, amenity) => {
        if (!acc[amenity.category]) {
          acc[amenity.category] = []
        }
        acc[amenity.category].push(amenity)
        return acc
      },
      {} as Record<string, typeof mockAmenities>,
    )

    return NextResponse.json({
      success: true,
      amenities: filteredAmenities,
      groupedAmenities,
      total: filteredAmenities.length,
      categories: [...new Set(mockAmenities.map((a) => a.category))],
    })
  } catch (error) {
    console.error("Get amenities error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const endpoint = queryString ? `/api/amenities?${queryString}` : '/api/amenities'
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch amenities' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get amenities error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
