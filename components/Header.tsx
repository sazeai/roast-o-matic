'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Zap, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/ai-roast-bot', label: 'AI Roast Bot' },
  { href: '/ethics', label: 'Ethics' },

]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    open: {
      x: "0%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <header className="bg-[#1C1C1C] border-b border-[#2A2A2A] relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#1C1C1C]" />
          </div>
          <span className="text-xl font-bold text-white">Roast-O-Matic</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button 
                    variant="ghost" 
                    className={`${item.label === 'Ethics' ? 'text-[#FFB800]' : 'text-white'} hover:text-[#FFB800]`}
                  >
                    {item.label}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          className="md:hidden text-white hover:text-[#FFB800]"
          onClick={toggleMenu}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
              <Link href="/" className="flex items-center space-x-2" onClick={toggleMenu}>
                <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <span className="text-xl font-bold text-white">Roast-O-Matic</span>
              </Link>
              <Button
                variant="ghost"
                className="text-white hover:text-[#FFB800] p-0 hover:bg-transparent"
                onClick={toggleMenu}
              >
                <X className="w-8 h-8" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav className="px-6 py-8">
              <ul className="space-y-2">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link 
                      href={item.href}
                      className={`text-xl font-medium block py-2 transition-colors ${
                        item.label === 'Ethics' 
                          ? 'text-[#FFB800]' 
                          : 'text-white hover:text-[#FFB800]'
                      }`}
                      onClick={toggleMenu}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

