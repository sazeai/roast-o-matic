import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Zap } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-[#1C1C1C] border-b border-[#2A2A2A]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#1C1C1C]" />
          </div>
          <span className="text-xl font-bold text-white">Roast-O-Matic</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">
                <Button variant="ghost" className="text-white hover:text-[#FFB800]">
                  Home
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/ai-roast-bot">
                <Button variant="ghost" className="text-white hover:text-[#FFB800]">
                  AI Roast Bot
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

