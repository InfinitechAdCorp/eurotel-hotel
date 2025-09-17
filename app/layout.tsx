import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"
import FloatingSocialIcons from "@/components/FloatingSocialIcons"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Eurotel Hotel - Luxury Accommodation & Premium Hospitality Services",
  description:
    "Experience unparalleled luxury at Eurotel Hotel. Premium rooms, world-class amenities, exceptional service, and unforgettable stays in the heart of the city.",
  keywords: [
    "luxury hotel",
    "premium accommodation",
    "five star hotel",
    "business hotel",
    "vacation resort",
    "hotel booking",
    "luxury suites",
    "executive rooms",
    "conference facilities",
    "wedding venue",
    "spa services",
    "fine dining",
    "room service",
    "concierge",
    "valet parking",
    "fitness center",
    "swimming pool",
    "business center",
    "meeting rooms",
    "event planning",
    "luxury travel",
    "hospitality",
    "guest services",
    "hotel amenities",
    "city center hotel",
    "boutique hotel",
    "premium hospitality",
    "luxury accommodation",
    "hotel reservations",
    "travel booking",
    "comfort rooms",
    "deluxe suites",
    "presidential suite",
    "family rooms",
    "accessible rooms",
    "hotel deals",
    "special offers",
    "weekend getaway",
    "business travel",
    "leisure travel",
    "Eurotel",
    "luxury experience",
    "exceptional service",
    "world class amenities",
    "unforgettable stay",
  ].join(", "),
  authors: [{ name: "Eurotel Hotel" }],
  creator: "Eurotel Hotel",
  publisher: "Eurotel Hotel",
  robots: "index, follow",
  openGraph: {
    title: "Eurotel Hotel - Where Service and Comfort Meet",
    description:
      "Experience luxury redefined at Eurotel. From elegantly appointed rooms to world-class amenities, every detail is crafted to exceed your expectations.",
    type: "website",
    locale: "en_US",
    siteName: "Eurotel Hotel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eurotel Hotel - Luxury Accommodation",
    description: "Experience unparalleled luxury and comfort at Eurotel Hotel. Book your perfect stay today.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#059669",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans">
        <ClientLayout>{children}</ClientLayout>
        <FloatingSocialIcons />
      </body>
    </html>
  )
}