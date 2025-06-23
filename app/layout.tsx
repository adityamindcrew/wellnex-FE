import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WellnexAI",
  description: "AI-powered chatbot for wellness businesses",
  icons: {
    icon: { url: '/logo.png', type: 'image/png' },
    apple: { url: '/logo.png', type: 'image/png' }
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" type="image/png" href="/logo.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
