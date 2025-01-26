"use server"

import { kv } from "@vercel/kv"
import { z } from "zod"
import { moderateContent } from "@/utils/contentModeration"
import { getUserId } from "@/utils/userIdentification"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type Theme = "gamer" | "work" | "sibling" | "random" | "tech-nerd" | "foodie" | "fitness-freak" | "social-media-addict"
type RoastLevel =
  | "mild-toast"
  | "medium-burn"
  | "crispy-roast"
  | "sizzling-burn"
  | "extra-spicy"
  | "savage-flame"
  | "nuclear-roast"

const themes: Record<Theme, string> = {
  gamer: "Generate a funny, light-hearted roast about a gamer. Use gaming terminology and stereotypes.",
  work: "Create a humorous roast about a coworker or boss. Use office and work-related jokes.",
  sibling: "Produce a playful roast about a sibling. Include family dynamics and childhood references.",
  "tech-nerd":
    "Craft a witty roast about a technology enthusiast. Use tech jargon and stereotypes about tech-savvy individuals.",
  foodie: "Whip up a spicy roast about a food lover. Incorporate culinary terms and jokes about eating habits.",
  "fitness-freak":
    "Pump up a muscular roast about a fitness enthusiast. Use gym lingo and jokes about workout obsession.",
  "social-media-addict":
    "Post a viral roast about a social media addict. Include references to popular platforms and online behavior.",
  random:
    "Generate a creative, unexpected, and funny personal roast. Make it feel spontaneous and unique. Avoid any gender-specific references. Focus on common human behaviors, habits, or personality traits that anyone might have. Keep it light-hearted and playful.",
}

const roastLevels: Record<RoastLevel, string> = {
  "mild-toast": "Keep it light and playful. Gentle teasing only.",
  "medium-burn": "A bit more bite, but still friendly. Slightly sharper jabs.",
  "crispy-roast": "Turn up the heat with more pointed remarks. Still maintain a playful tone.",
  "sizzling-burn": "Deliver fiery roasts with sharper wit. Push the boundaries but stay respectful.",
  "extra-spicy": "Intense roasts with hard-hitting humor. Not for the faint of heart.",
  "savage-flame": "Ruthless and relentless roasts. No holding back, but avoid crossing ethical lines.",
  "nuclear-roast":
    "Ultimate destruction. The most intense and devastating roasts possible while still being ethical and avoiding truly offensive content.",
}

const roastStyles = [
  "sarcastic",
  "witty",
  "absurd",
  "deadpan",
  "self-deprecating",
  "observational",
  "exaggerated",
  "pun-based",
]

const roastTopics = [
  "technology addiction",
  "social media habits",
  "procrastination",
  "fashion choices",
  "food preferences",
  "binge-watching",
  "fitness routines",
  "online shopping habits",
  "autocorrect mishaps",
  "emoji overuse",
]

const promptEnhancers = [
  "Imagine the most ridiculous scenario related to the theme and incorporate it.",
  "Think of a popular meme or internet trend and weave it into the roast.",
  "Create a witty comparison between the roast target and an unexpected object or concept.",
  "Invent a humorous backstory for the roast target based on the theme.",
  "Use a play on words or pun related to the theme or target.",
]

async function updateLocalCache() {
  try {
    const [recentRoasts, mainRoastUsers, mainRoastCount, aiBotRoastCount] = await Promise.all([
      kv.lrange(ROAST_MEMORY_KEY, 0, -1),
      kv.smembers(MAIN_ROAST_USERS_KEY),
      kv.get<number>(MAIN_ROAST_COUNT_KEY),
      kv.get<number>(AI_BOT_ROAST_COUNT_KEY),
    ])

    localCache = {
      recentRoasts: recentRoasts || [],
      mainRoastUsers: new Set(mainRoastUsers),
      mainRoastCount: mainRoastCount || 0,
      aiBotRoastCount: aiBotRoastCount || 0,
      lastUpdated: Date.now(),
    }
  } catch (error) {
    console.error("Error updating local cache:", error)
  }
}

async function incrementMainRoastStats(userId: string) {
  try {
    console.log("Incrementing main roast stats for user:", userId)
    if (!localCache.mainRoastUsers.has(userId)) {
      console.log("New user detected, adding to KV store and local cache")
      await kv.sadd(MAIN_ROAST_USERS_KEY, userId)
      localCache.mainRoastUsers.add(userId)
    }
    await kv.incr(MAIN_ROAST_COUNT_KEY)
    localCache.mainRoastCount++
    console.log("Updated main roast stats:", {
      uniqueUsers: localCache.mainRoastUsers.size,
      totalRoasts: localCache.mainRoastCount,
    })
  } catch (error) {
    console.error("Error incrementing main roast stats:", error)
  }
}

async function incrementAIBotRoastCount() {
  try {
    await kv.incr(AI_BOT_ROAST_COUNT_KEY)
    localCache.aiBotRoastCount++
    console.log("Updated AI bot roast count:", localCache.aiBotRoastCount)
  } catch (error) {
    console.error("Error incrementing AI bot roast count:", error)
  }
}

export async function incrementStats(userId: string) {
  if (Date.now() - localCache.lastUpdated > CACHE_EXPIRY) {
    await updateLocalCache()
  }
  await incrementMainRoastStats(userId)
}

const config = {
  apiKey: process.env.OPENAI_API_KEY,
}

const MAIN_ROAST_USERS_KEY = "main_roast_users"
const MAIN_ROAST_COUNT_KEY = "main_roast_count"
const AI_BOT_ROAST_COUNT_KEY = "ai_bot_roast_count"
const ROAST_MEMORY_KEY = "recent_roasts"
const MAX_ROAST_MEMORY = 20
const CACHE_EXPIRY = 60 * 60 * 1000 // 1 hour in milliseconds

let localCache: {
  recentRoasts: string[]
  mainRoastUsers: Set<string>
  mainRoastCount: number
  aiBotRoastCount: number
  lastUpdated: number
} = {
  recentRoasts: [],
  mainRoastUsers: new Set(),
  mainRoastCount: 0,
  aiBotRoastCount: 0,
  lastUpdated: 0,
}

export async function generateRoast(roastTarget: string | undefined, theme: Theme, level: RoastLevel) {
  const userId = getUserId()
  console.log("Generating roast with:", { roastTarget, theme, level })

  const isValid = await validateRoastInput(roastTarget, theme, level)
  if (!isValid) {
    return "Invalid input. Please try again with valid parameters."
  }

  if (Date.now() - localCache.lastUpdated > CACHE_EXPIRY) {
    await updateLocalCache()
  }

  const recentRoasts = localCache.recentRoasts

  const themePrompt = themes[theme] || themes.random
  const levelPrompt = roastLevels[level]
  const randomStyle = roastStyles[Math.floor(Math.random() * roastStyles.length)]
  const randomTopic = roastTopics[Math.floor(Math.random() * roastTopics.length)]
  const randomEnhancer = promptEnhancers[Math.floor(Math.random() * promptEnhancers.length)]

  let basePrompt = `${themePrompt} ${levelPrompt}`
  if (roastTarget && roastTarget.trim()) {
    basePrompt += ` The roast target is: ${roastTarget}.`
  } else {
    basePrompt += ` Generate a general roast without a specific target.`
  }

  const prompt = `${basePrompt}
    Use a ${randomStyle} style of humor.
    If appropriate, incorporate a joke about ${randomTopic}.
    ${randomEnhancer}
    Ensure this roast is unique and different from previous ones.
    Keep it brief (1-2 sentences) and adhere to the specified roast level.
    Make the roast relatable and contextual to the theme and target.
    Current timestamp: ${Date.now()} (use this to seed your randomness).
    
    IMPORTANT: Avoid these recently used roast structures or ideas:
    ${recentRoasts.slice(0, 3).join("\n")}
    
    Create a fresh, surprising roast that will make people laugh out loud.`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a witty, clever roast generator. Your roasts are always unique, contextual, and hit the right balance of humor and bite based on the requested level. You never explain the joke or use placeholder text.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 100,
      }),
    })

    const result = await response.json()
    const text = result.choices[0].message.content

    console.log("Generated roast:", text)

    try {
      // Update local cache and KV store
      localCache.recentRoasts.unshift(text)
      localCache.recentRoasts = localCache.recentRoasts.slice(0, MAX_ROAST_MEMORY)
      await kv.lpush(ROAST_MEMORY_KEY, text)
      await kv.ltrim(ROAST_MEMORY_KEY, 0, MAX_ROAST_MEMORY - 1)
    } catch (error) {
      console.error("Error updating roast memory:", error)
    }

    // Update stats for main roast generator
    await incrementMainRoastStats(userId)

    return text
  } catch (error) {
    console.error("Error generating roast:", error)
    return "Sorry, I couldn't come up with a roast. My humor circuit must be malfunctioning!"
  }
}

export async function userRoast(userInput: string) {
  const userId = getUserId()
  const isValid = await validateUserRoastInput(userInput)
  if (!isValid) {
    return "Invalid input. Please try again with a valid roast."
  }
  try {
    // First, moderate the user input
    const isInputSafe = await moderateContent(userInput)
    if (!isInputSafe) {
      return "I can't respond to that kind of language. Let's keep it clean and fun!"
    }

    const prompt = `The user tried to roast the AI with: "${userInput}"
    Come up with a sharp, humorous, funny comeback that turns the tables and gives the user a playful burn. Make it clever, surprising, and light-hearted, keeping it short and snappy (1-2 sentences). Each response should be fresh and unique, giving them a reason to laugh at themselves.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 300,
    })

    const text = completion.choices[0].message.content

    // Increment AI bot roast count
    await incrementAIBotRoastCount()

    return text
  } catch (error) {
    console.error("Error generating user roast response:", error)
    return "Nice try, but I'm too cool to compute a comeback right now. You get a free pass... this time."
  }
}

export async function aiRoast() {
  const userId = getUserId()
  const prompt = `Generate a creative, unexpected, and funny roast directed at the user. 
  Make it feel spontaneous and unique. Focus on common human behaviors, habits, or personality traits. 
  Keep it light-hearted and playful, but with a sharp wit. The roast should be 1-2 sentences long.`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
    })

    const result = await response.json()
    const text = result.choices[0].message.content

    // Increment AI bot roast count
    await incrementAIBotRoastCount()

    return text
  } catch (error) {
    console.error("Error generating AI roast:", error)
    return "Looks like my roast circuits are fried. You win this round, human!"
  }
}

export async function fetchStats() {
  console.log("Fetching stats, cache age:", Date.now() - localCache.lastUpdated)
  if (Date.now() - localCache.lastUpdated > CACHE_EXPIRY) {
    console.log("Cache expired, updating...")
    await updateLocalCache()
  }
  console.log("Returning stats:", {
    uniqueUsers: localCache.mainRoastUsers.size,
    totalRoasts: localCache.mainRoastCount,
    aiBotRoasts: localCache.aiBotRoastCount,
  })
  return {
    uniqueUsers: localCache.mainRoastUsers.size,
    totalRoasts: localCache.mainRoastCount,
    aiBotRoasts: localCache.aiBotRoastCount,
  }
}

export async function validateRoastInput(roastTarget: string | undefined, theme: Theme, level: RoastLevel) {
  const schema = z.object({
    roastTarget: z.string().min(1).max(100).optional(),
    theme: z.enum([
      "gamer",
      "work",
      "sibling",
      "random",
      "tech-nerd",
      "foodie",
      "fitness-freak",
      "social-media-addict",
    ]),
    level: z.enum([
      "mild-toast",
      "medium-burn",
      "crispy-roast",
      "sizzling-burn",
      "extra-spicy",
      "savage-flame",
      "nuclear-roast",
    ]),
  })

  try {
    schema.parse({ roastTarget, theme, level })
    return true
  } catch (error) {
    console.error("Validation error:", error)
    return false
  }
}

export async function validateUserRoastInput(userInput: string) {
  const schema = z.object({
    userInput: z.string().min(1).max(500),
  })

  try {
    schema.parse({ userInput })
    return true
  } catch (error) {
    console.error("Validation error:", error)
    return false
  }
}

