'use client'

import { useEffect, useState } from 'react'
import { fetchStats } from '@/app/actions'
import { motion, AnimatePresence } from 'framer-motion'

export default function StatsDisplay() {
  const [stats, setStats] = useState({ uniqueUsers: 0, totalRoasts: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateStats = async () => {
      const newStats = await fetchStats()
      setStats(newStats)
      setIsLoading(false)
    }

    updateStats()
    // Update stats every minute
    const interval = setInterval(updateStats, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mt-8 text-center">
      <div className="flex justify-center gap-1 mb-2">
        {'★★★★★'.split('').map((star, i) => (
          <span key={i} className="text-[#FFB800]">{star}</span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-gray-400"
          >
            <span className="text-white font-semibold">{stats.uniqueUsers.toLocaleString()}</span> egos bruised, <span className="text-white font-semibold">{stats.totalRoasts.toLocaleString()}</span> laughs induced!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

