import { type NextRequest, NextResponse } from "next/server"

// Mock hotel information - In production, this would come from database/CMS
const hotelInfo = {
  name: "Eurotel Hotel",
  tagline: "Where service and comfort meet",
  description:
    "Experience luxury redefined at Eurotel. From our elegantly appointed rooms to our world-class amenities, every detail is crafted to exceed your expectations.",
  contact: {
    phone: "+1 (555) 123-4567",
    email: "info@eurotel.com",
    address: {
      street: "123 Luxury Avenue",
      city: "City Center",
      state: "State",
      zipCode: "12345",
      country: "Country",
    },
  },
  socialMedia: {
    facebook: "https://facebook.com/eurotel",
    twitter: "https://twitter.com/eurotel",
    instagram: "https://instagram.com/eurotel",
    linkedin: "https://linkedin.com/company/eurotel",
  },
  policies: {
    checkIn: "3:00 PM",
    checkOut: "11:00 AM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    petPolicy: "Pets allowed with additional fee",
    smokingPolicy: "Non-smoking property",
    ageRestriction: "Guests must be 18 or older to check in",
  },
  amenities: [
    {
      id: "1",
      name: "Free WiFi",
      description: "High-speed internet throughout the hotel",
      category: "connectivity",
      icon: "wifi",
    },
    {
      id: "2",
      name: "Free Parking",
      description: "Complimentary valet parking service",
      category: "parking",
      icon: "car",
    },
    {
      id: "3",
      name: "24/7 Room Service",
      description: "Round-the-clock dining at your convenience",
      category: "dining",
      icon: "room-service",
    },
    {
      id: "4",
      name: "Fine Dining Restaurant",
      description: "Award-winning restaurant with international cuisine",
      category: "dining",
      icon: "restaurant",
    },
    {
      id: "5",
      name: "Fitness Center",
      description: "State-of-the-art gym equipment",
      category: "fitness",
      icon: "gym",
    },
    {
      id: "6",
      name: "Swimming Pool",
      description: "Outdoor pool with city views",
      category: "recreation",
      icon: "pool",
    },
    {
      id: "7",
      name: "Spa & Wellness",
      description: "Full-service spa with massage and treatments",
      category: "wellness",
      icon: "spa",
    },
    {
      id: "8",
      name: "Business Center",
      description: "Meeting rooms and business facilities",
      category: "business",
      icon: "business",
    },
  ],
  awards: [
    {
      year: "2023",
      award: "Best Luxury Hotel Chain - European Hospitality Awards",
      organization: "European Hospitality Association",
    },
    {
      year: "2022",
      award: "Excellence in Customer Service - Global Travel Awards",
      organization: "Global Travel Association",
    },
    {
      year: "2021",
      award: "Sustainable Tourism Leader - Green Hospitality Initiative",
      organization: "Green Hospitality Initiative",
    },
    {
      year: "2020",
      award: "Top Rated Hotel Brand - TravelChoice Awards",
      organization: "TravelChoice",
    },
  ],
  statistics: {
    yearsOfExperience: 38,
    locationsWorldwide: 50,
    happyGuests: 1000000,
    guestSatisfaction: 98,
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    // Return specific section if requested
    if (section) {
      switch (section) {
        case "contact":
          return NextResponse.json({
            success: true,
            data: hotelInfo.contact,
          })
        case "amenities":
          return NextResponse.json({
            success: true,
            data: hotelInfo.amenities,
          })
        case "policies":
          return NextResponse.json({
            success: true,
            data: hotelInfo.policies,
          })
        case "awards":
          return NextResponse.json({
            success: true,
            data: hotelInfo.awards,
          })
        case "statistics":
          return NextResponse.json({
            success: true,
            data: hotelInfo.statistics,
          })
        default:
          return NextResponse.json(
            {
              success: false,
              error: "Invalid section requested",
            },
            { status: 400 },
          )
      }
    }

    // Return all hotel information
    return NextResponse.json({
      success: true,
      data: hotelInfo,
    })
  } catch (error) {
    console.error("Get hotel info error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Example of how to integrate with Laravel backend:
/*
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    
    const endpoint = section ? `/api/hotel/info?section=${section}` : '/api/hotel/info'
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch hotel info' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get hotel info error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
*/
