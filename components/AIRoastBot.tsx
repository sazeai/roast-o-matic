'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Zap, Bot, User, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiRoast, userRoast } from '@/app/actions'
import { toast } from '@/hooks/use-toast'
import debounce from 'lodash.debounce';

// Custom hook for typing effect
const useTypingEffect = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let i = 0
    setIsComplete(false)
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i))
        i++
      } else {
        clearInterval(typingInterval)
        setIsComplete(true)
      }
    }, speed)

    return () => clearInterval(typingInterval)
  }, [text, speed])

  return { displayedText, isComplete }
}

type Message = {
  sender: 'user' | 'ai' | 'system'
  content: string
}

const emojis = ['🔥', '😈', '💀', '🤖', '🎭']

export default function AIRoastBot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [currentAIMessage, setCurrentAIMessage] = useState('')
  const { displayedText, isComplete } = useTypingEffect(currentAIMessage)

const debouncedSetUserInput = useCallback(
  debounce((value: string) => setUserInput(value), 100),
  []
);


  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping, displayedText])

  const handleUserRoast = async () => {
    if (!userInput.trim() || isLoading) return

    setIsLoading(true)
    const newMessages: Message[] = [...messages, { sender: 'user', content: userInput }]
    setMessages(newMessages)
    setUserInput('')
    setIsTyping(true)
    
    try {
      const aiResponse = await userRoast(userInput)
      setCurrentAIMessage(aiResponse || '')
      setIsTyping(false)
    } catch (error) {
      setIsTyping(false)
      toast({
        title: "Error generating response",
        description: "The AI is having trouble with that sick burn. Try again!",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleAIRoast = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setIsTyping(true)
    try {
      const aiRoastResponse = await aiRoast()
      setCurrentAIMessage(aiRoastResponse || '')
      setIsTyping(false)
    } catch (error) {
      setIsTyping(false)
      toast({
        title: "Error generating roast",
        description: "The AI's roast generator is taking a break. Try again!",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  useEffect(() => {
    if (isComplete) {
      setMessages(prev => [...prev, { sender: 'ai', content: currentAIMessage }])
      setCurrentAIMessage('')
    }
  }, [isComplete, currentAIMessage])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#1C1C1C]">
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#FFB800]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Roast Bot</h1>
            <p className="text-sm text-gray-400">Ready to trade some burns?</p>
          </div>
        </div>
      </div>

      <ScrollArea 
        ref={scrollRef} 
        className="flex-1 p-4 pb-32"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #232323 0%, #1C1C1C 100%)'
        }}
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[#FFB800]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome to the Roast Arena!</h2>
            <p className="text-gray-400 max-w-md">
              Challenge the AI to a battle of wits and burns. Who will emerge victorious in this verbal sparring match?
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.sender === 'user' ? 'bg-[#FFB800]' : 
                      message.sender === 'ai' ? 'bg-[#2A2A2A]' : 'bg-red-500'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4 text-black" />
                      ) : message.sender === 'ai' ? (
                        <Bot className="w-4 h-4 text-[#FFB800]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`relative rounded-lg p-4 ${
                        message.sender === 'user'
                          ? 'bg-[#FFB800] text-black'
                          : message.sender === 'ai'
                          ? 'bg-[#2A2A2A] text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {message.content}
                      {message.sender !== 'system' && (
                        <span className="absolute top-2 right-2 text-xl opacity-20">
                          {emojis[Math.floor(Math.random() * emojis.length)]}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && !currentAIMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div className="bg-[#2A2A2A] rounded-lg p-4 text-white">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-[#FFB800] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#FFB800] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-[#FFB800] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {currentAIMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-[#FFB800]" />
                    </div>
                    <div className="bg-[#2A2A2A] rounded-lg p-4 text-white">
                      {displayedText}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        )}
      </ScrollArea>

      <div className="relative p-4 border-t border-[#2A2A2A] bg-[#1C1C1C]">
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your roast here..."
              value={userInput}
              onChange={(e) => {
                setUserInput(e.target.value); // Immediate update
                debouncedSetUserInput(e.target.value); // Debounced update for expensive operations
              }}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleUserRoast()}
              className="flex-grow bg-[#2A2A2A] border-[#333333] text-white placeholder-gray-400"
              disabled={isLoading}
            />
            <Button
              onClick={handleUserRoast}
              disabled={isLoading || !userInput.trim()}
              className="bg-[#FFB800] hover:bg-[#FFA800] text-black font-semibold shrink-0"
            >
              <Zap className="w-4 h-4 mr-2" />
              Roast
            </Button>
          </div>
          <Button
            onClick={handleAIRoast}
            disabled={isLoading}
            variant="outline"
            className="border-[#2A2A2A] hover:bg-[#2A2A2A] text-gray-400 hover:text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Let AI Roast You
          </Button>
        </div>
        {isLoading && !isTyping && !currentAIMessage && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] text-sm text-gray-400">
              <div className="w-2 h-2 bg-[#FFB800] rounded-full animate-pulse" />
              AI is cooking up a response...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

