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
         <a
          href="https://www.producthunt.com/posts/roast-o-matic?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-roast&#0045;o&#0045;matic"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=820732&theme=dark&t=1737881218290"
            alt="Roast&#0045;O&#0045;Matic - Roast&#0045;O&#0045;matic&#0032;&#0124;&#0032;get&#0032;roasted&#0032;faster&#0032;than&#0032;your&#0032;wi&#0045;fi | Product Hunt"
            style={{ width: '200px', height: '43px' }}
            width="200"
            height="43"
          />
        </a>
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

