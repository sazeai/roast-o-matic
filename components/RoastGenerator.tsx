'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Zap, Bot, Share2, Flame } from 'lucide-react'
import { generateRoast } from '@/app/actions'
import { motion, AnimatePresence } from 'framer-motion'
import StatsDisplay from './StatsDisplay'
import Link from 'next/link'
import { toast } from "@/hooks/use-toast"
import { getUserId } from '@/utils/userIdentification'

type Theme = 'gamer' | 'work' | 'sibling' | 'random' | 'tech-nerd' | 'foodie' | 'fitness-freak' | 'social-media-addict'
type RoastLevel = 'mild-toast' | 'medium-burn' | 'crispy-roast' | 'sizzling-burn' | 'extra-spicy' | 'savage-flame' | 'nuclear-roast'

const emojis = ['🔥', '😂', '💀', '🤯', '🎭']

const roastLevels: { [key in RoastLevel]: string } = {
  'mild-toast': 'Mild Toast',
  'medium-burn': 'Medium Burn',
  'crispy-roast': 'Crispy Roast',
  'sizzling-burn': 'Sizzling Burn',
  'extra-spicy': 'Extra Spicy',
  'savage-flame': 'Savage Flame',
  'nuclear-roast': 'Nuclear Roast'
}

export default function RoastGenerator() {
  const [theme, setTheme] = useState<Theme>('random')
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('medium-burn')
  const [roast, setRoast] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emoji, setEmoji] = useState('')
  const [isHovering, setIsHovering] = useState(false)
  const [roastTarget, setRoastTarget] = useState('')
  const [userId] = useState(getUserId())

  const handleRoast = async (surpriseMe = false) => {
    setIsLoading(true)
    const roastTheme = surpriseMe ? 'random' : theme
    try {
      const generatedRoast = await generateRoast(roastTarget, roastTheme, roastLevel)
      setRoast(generatedRoast)
      setEmoji(emojis[Math.floor(Math.random() * emojis.length)])
    } catch (error) {
      console.error('Error generating roast:', error)
      setRoast("Oops! Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this roast!',
          text: roast,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      await navigator.clipboard.writeText(roast)
      toast({
        title: "Roast copied to clipboard!",
        description: "Share it with your friends and spread the burn!",
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#1C1C1C]" />
          </div>
          <h2 className="text-xl font-semibold text-white">Roast-O-Matic</h2>
        </div>
        <div className="relative inline-block">
          <div className="absolute inset-0 mx-auto w-32 h-32 bg-[#FFB800] rounded-full blur-3xl opacity-20"></div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4 relative">
            Get Roasted Faster
            <span className="block">
              Than Your <span className="bg-[#E8E3D9] text-[#1C1C1C] px-3 py-1 rounded-md inline-block">Wi-Fi</span>
            </span>
          </h1>
          <div className="mt-4 text-center text-sm text-gray-500">
            Remember: These roasts are AI-generated. No AIs were harmed in the making of this app.
          </div>
        </div>
      </div>
      <Card className="bg-[#232323] border-0 shadow-2xl">
        <CardContent className="p-3">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <Input
                type="text"
                placeholder="Enter name, description, or anything about the roast target"
                value={roastTarget}
                onChange={(e) => setRoastTarget(e.target.value)}
                className="bg-[#2A2A2A] border-0 text-white placeholder-gray-400 h-12"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select onValueChange={(value) => setTheme(value as Theme)}>
                  <SelectTrigger className="bg-[#2A2A2A] border-0 text-gray-300 h-12">
                    <SelectValue placeholder="Select a roast flavor" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#333333]">
                    <SelectItem value="gamer" className="text-gray-300">Gamer Burn</SelectItem>
                    <SelectItem value="work" className="text-gray-300">Office Roast</SelectItem>
                    <SelectItem value="sibling" className="text-gray-300">Sibling Rivalry</SelectItem>
                    <SelectItem value="tech-nerd" className="text-gray-300">Tech Nerd Takedown</SelectItem>
                    <SelectItem value="foodie" className="text-gray-300">Culinary Critic</SelectItem>
                    <SelectItem value="fitness-freak" className="text-gray-300">Gym Junkie Jabs</SelectItem>
                    <SelectItem value="social-media-addict" className="text-gray-300">Social Media Mockery</SelectItem>
                    <SelectItem value="random" className="text-gray-300">Random Roast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select onValueChange={(value) => setRoastLevel(value as RoastLevel)}>
                  <SelectTrigger className="bg-[#2A2A2A] border-0 text-gray-300 h-12">
                    <SelectValue placeholder="Select roast intensity" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#333333]">
                    {Object.entries(roastLevels).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-gray-300">
                        <div className="flex items-center">
                          <Flame className="w-4 h-4 mr-2" />
                          <span>{label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={() => handleRoast()} 
              disabled={isLoading || !roastTarget.trim()} 
              className="w-full bg-[#FFB800] hover:bg-[#FFA800] text-black font-semibold h-12 disabled:opacity-50"
            >
              {isLoading ? 'Cooking up a roast...' : 'Generate Roast'}
              <Zap className="w-4 h-4 ml-2" />
            </Button>

            <AnimatePresence>
              {roast && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-2 bg-[#2A2A2A] rounded-xl relative"
                >
                  <p className="text-md text-white leading-relaxed">{roast}</p>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    {emoji}
                  </motion.span>
                  <Button
                    onClick={handleShare}
                    className="mt-4 bg-[#3A3A3A] hover:bg-[#4A4A4A] text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Roast
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        <motion.div
          className="absolute -left-4 top-0 -translate-y-1/2 z-10"
          initial={{ rotate: -10, y: 0 }}
          animate={{ rotate: 10, y: [0, -10, 0] }}
          transition={{
            rotate: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2
            },
            y: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3,
              ease: "easeInOut"
            }
          }}
        >
          <motion.button
            onClick={() => handleRoast(true)}
            disabled={isLoading}
            className="bg-[#FFB800] hover:bg-[#FFA800] text-black font-semibold py-2 px-2 rounded-lg shadow-lg transform transition-transform duration-200 ease-in-out"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 mr-2 inline-block" />
            <span className="hidden sm:inline">Surprise Me!</span>
            <span className="sm:hidden">Surprise!</span>
          </motion.button>
        </motion.div>
      </Card>

      <StatsDisplay />

      {/* CTA Section */}
      <motion.div 
        className="mt-12 bg-[#2A2A2A] rounded-xl p-6 text-center relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Link href="/ai-roast-bot" className="block">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-[#FFB800] to-[#FF8A00] opacity-0"
            animate={{ opacity: isHovering ? 0.2 : 0 }}
          />
          <motion.div
            className="relative z-10"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <h3 className="text-2xl font-bold mb-2 text-white">Ready for a Real Challenge?</h3>
            <p className="text-gray-300 mb-4">Think you can out-roast an AI? Prove it!</p>
            <motion.div 
              className="inline-flex items-center gap-2 bg-[#FFB800] text-black font-semibold py-2 px-4 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bot className="w-5 h-5" />
              <span>Battle the AI Roast Bot</span>
            </motion.div>
          </motion.div>
        </Link>
        <motion.div
          className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#FFB800] rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  )
}

