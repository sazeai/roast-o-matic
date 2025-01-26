"use client"

import { useEffect, useState } from "react"
import { fetchStats } from "@/app/actions"
import { motion, AnimatePresence } from "framer-motion"

export default function StatsDisplay() {
  const [totalRoasts, setTotalRoasts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updateStats = async () => {
      try {
        const newStats = await fetchStats()
        setTotalRoasts(newStats.totalRoasts)
        setError(null)
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("Unable to fetch latest stats")
      } finally {
        setIsLoading(false)
      }
    }

    updateStats()
    // Update stats every minute
    const interval = setInterval(updateStats, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-8 text-center">
      <div className="flex justify-center gap-1 mb-2">
        {"★★★★★".split("").map((star, i) => (
          <span key={i} className="text-[#FFB800]">
            {star}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {!isLoading && !error && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-gray-400"
          >
            <span className="text-white font-semibold">{totalRoasts.toLocaleString()}</span> laughs induced!
          </motion.p>
        )}
        {!isLoading && error && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-gray-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

