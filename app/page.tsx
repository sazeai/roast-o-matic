import { Metadata } from 'next'
import RoastGenerator from '@/components/RoastGenerator'

export const metadata: Metadata = {
  title: 'Roast-O-Matic | Get Roasted Faster Than Your Wi-Fi',
  description: 'A playful, automated tool designed to generate clever, humorous comebacks or roasts. It delivers light-hearted, personalized burns with machine-like efficiency, making it the go-to for quick, entertaining roasts.',
}

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <RoastGenerator />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebApplication",
            "name": "Roast-O-Matic",
            "url": "https://roastomatic.fun",
            "description": "A playful, automated tool designed to generate clever, humorous comebacks or roasts.",
            "applicationCategory": "Entertainment",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </>
  )
}

