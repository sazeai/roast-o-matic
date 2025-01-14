import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] border-t border-[#2A2A2A]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Roast-O-Matic. All rights and laughs reserved.
          </div>
          <div className="flex space-x-4">
            <Link href="/ethics" target="_blank" rel="noopener noreferrer">
              <p className="w-6 h-6 text-[#FFB800] hover:text-[#FFB800]">Ethics</p> 
            </Link>
            
          </div>
        </div>
        
      </div>
    </footer>
  )
}

