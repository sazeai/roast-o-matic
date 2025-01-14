import { Metadata } from 'next'
import AIRoastBot from '@/components/AIRoastBot'

export const metadata: Metadata = {
  title: 'AI Roast Bot Challenge | Roast-O-Matic',
  description: 'Challenge our AI to a roast battle! Trade witty comebacks and see who comes out on top in this entertaining, fast-paced roasting competition.',
}

export default function AIRoastBotPage() {
  return (
    <>
      <AIRoastBot />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "WebApplication",
            "name": "AI Roast Bot",
            "url": "https://roastomatic.fun/ai-roast-bot",
            "description": "An AI-powered roast battle simulator where users can challenge the bot to a witty comeback competition.",
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

