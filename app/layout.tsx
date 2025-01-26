import './globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roast-O-Matic | Get Roasted Faster Than Your Wi-Fi',
  description: 'Get roasted by the most savage AI in the multiverse!',
   verification: {
    google: 'cX5G8Ppw6xFKrCObdgq7qkjOG3eZGBgyDxSBnQnvv24',
  },
  openGraph: {
    title: 'Roast-O-Matic | Get Roasted Faster Than Your Wi-Fi',
    description: 'A playful, automated tool designed to generate clever, humorous comebacks or roasts.',
    url: 'https://roastomatic.fun',
    siteName: 'Roast-O-Matic',
    images: [
      {
        url: 'https://roastomatic.fun/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Roast-O-Matic | Get Roasted Faster Than Your Wi-Fi',
    description: 'A playful, automated tool for clever, humorous roasts.',
    images: ['https://roastomatic.fun/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1C1C1C] text-white antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://schema.org",
              "@type": "WebSite",
              "name": "Roast-O-Matic",
              "url": "https://roastomatic.fun",
              "description": "A playful, automated tool designed to generate clever, humorous comebacks or roasts. It delivers light-hearted, personalized burns with machine-like efficiency, making it the go-to for quick, entertaining roasts."
            })
          }}
        />
      </body>
    </html>
  )
}

