import React, { useState, useEffect } from "react"
import { fetchStats } from "@/app/actions"

const StatsDisplay = () => {
  const [stats, setStats] = useState({ uniqueUsers: 0, totalRoasts: 0 })

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const data = await fetchStats()
        setStats(data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStatsData()
    // Set up an interval to fetch stats every 5 minutes
    const intervalId = setInterval(fetchStatsData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="bg-[#2A2A2A] p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Roast Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-gray-400">Unique Users</p>
          <p className="text-2xl font-bold text-[#FFB800]">{stats.uniqueUsers}</p>
        </div>
        <div>
          <p className="text-gray-400">Total Roasts</p>
          <p className="text-2xl font-bold text-[#FFB800]">{stats.totalRoasts}</p>
        </div>
      </div>
    </div>
  )
}

export default StatsDisplay

