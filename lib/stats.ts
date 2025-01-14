import { kv } from '@vercel/kv'

const DAILY_USERS_KEY = 'daily_users'
const DAILY_ROASTS_KEY = 'daily_roasts'
const DAILY_STATS_KEY = 'daily_stats'

export async function incrementDailyStats(userId: string) {
  const today = new Date().toISOString().split('T')[0]
  const userKey = `${DAILY_USERS_KEY}:${today}`
  const roastKey = `${DAILY_ROASTS_KEY}:${today}`
  const statsKey = `${DAILY_STATS_KEY}:${today}`

  // Add user to today's set
  await kv.sadd(userKey, userId)
  // Increment today's roast count
  await kv.incr(roastKey)

  // Get updated counts
  const [uniqueUsers, totalRoasts] = await Promise.all([
    kv.scard(userKey),
    kv.get<number>(roastKey)
  ])

  // Update daily stats
  await kv.set(statsKey, {
    uniqueUsers,
    totalRoasts
  })

  // Set expiry for all keys (48 hours to ensure we capture full day)
  const keys = [userKey, roastKey, statsKey]
  await Promise.all(keys.map(key => kv.expire(key, 48 * 60 * 60)))

  return { uniqueUsers, totalRoasts }
}

export async function getDailyStats() {
  const today = new Date().toISOString().split('T')[0]
  const statsKey = `${DAILY_STATS_KEY}:${today}`

  const stats = await kv.get<{ uniqueUsers: number; totalRoasts: number }>(statsKey)
  return stats || { uniqueUsers: 0, totalRoasts: 0 }
}

