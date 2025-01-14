'use server'

import { OpenAIApi, Configuration } from 'openai-edge'
import { moderateContent } from '@/utils/contentModeration'
import { incrementDailyStats, getDailyStats } from '@/lib/stats'
import { getUserId } from '@/utils/userIdentification'

// function generateUUID() {
//   return crypto.randomUUID();
// }

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

const DAILY_USERS_KEY = 'daily_users'
const DAILY_ROASTS_KEY = 'daily_roasts'
const DAILY_STATS_KEY = 'daily_stats'

type Theme = 'gamer' | 'work' | 'sibling' | 'random' | 'tech-nerd' | 'foodie' | 'fitness-freak' | 'social-media-addict'
type RoastLevel = 'mild-toast' | 'medium-burn' | 'crispy-roast' | 'sizzling-burn' | 'extra-spicy' | 'savage-flame' | 'nuclear-roast'

const themes: Record<Theme, string> = {
  gamer: "Generate a funny, light-hearted roast about a gamer. Use gaming terminology and stereotypes.",
  work: "Create a humorous roast about a coworker or boss. Use office and work-related jokes.",
  sibling: "Produce a playful roast about a sibling. Include family dynamics and childhood references.",
  "tech-nerd": "Craft a witty roast about a technology enthusiast. Use tech jargon and stereotypes about tech-savvy individuals.",
  foodie: "Whip up a spicy roast about a food lover. Incorporate culinary terms and jokes about eating habits.",
  "fitness-freak": "Pump up a muscular roast about a fitness enthusiast. Use gym lingo and jokes about workout obsession.",
  "social-media-addict": "Post a viral roast about a social media addict. Include references to popular platforms and online behavior.",
  random: "Generate a creative, unexpected, and funny personal roast. Make it feel spontaneous and unique. Avoid any gender-specific references. Focus on common human behaviors, habits, or personality traits that anyone might have. Keep it light-hearted and playful."
}

const roastLevels: Record<RoastLevel, string> = {
  'mild-toast': "Keep it light and playful. Gentle teasing only.",
  'medium-burn': "A bit more bite, but still friendly. Slightly sharper jabs.",
  'crispy-roast': "Turn up the heat with more pointed remarks. Still maintain a playful tone.",
  'sizzling-burn': "Deliver fiery roasts with sharper wit. Push the boundaries but stay respectful.",
  'extra-spicy': "Intense roasts with hard-hitting humor. Not for the faint of heart.",
  'savage-flame': "Ruthless and relentless roasts. No holding back, but avoid crossing ethical lines.",
  'nuclear-roast': "Ultimate destruction. The most intense and devastating roasts possible while still being ethical and avoiding truly offensive content."
}

const roastStyles = [
  "sarcastic",
  "witty",
  "absurd",
  "deadpan",
  "self-deprecating",
  "observational",
  "exaggerated",
  "pun-based"
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
  "emoji overuse"
]

export async function generateRoast(roastTarget: string, theme: Theme, level: RoastLevel) {
  const userId = getUserId()
  console.log('Generating roast with:', { roastTarget, theme, level })
  const themePrompt = themes[theme] || themes.random
  const levelPrompt = roastLevels[level]
  const randomStyle = roastStyles[Math.floor(Math.random() * roastStyles.length)]
  const randomTopic = roastTopics[Math.floor(Math.random() * roastTopics.length)]

  let basePrompt = `${themePrompt} ${levelPrompt}`
  if (roastTarget.trim()) {
    basePrompt += ` The roast target is: ${roastTarget}.`
  }

  const prompt = `${basePrompt}
    Use a ${randomStyle} style of humor.
    If appropriate, incorporate a joke about ${randomTopic}.
    Ensure each roast is unique and different from previous ones.
    Keep it brief and adhere to the specified roast level.
    Current timestamp: ${Date.now()} (use this to seed your randomness).`

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 300,
    })

    const result = await response.json()
    const text = result.choices[0].message.content

    console.log('Generated roast:', text)
    // Removed moderation check

    // Increment stats
    await incrementDailyStats(userId)

    return text
  } catch (error) {
    console.error('Error generating roast:', error)
    return "Sorry, I couldn't come up with a roast. My humor circuit must be malfunctioning!"
  }
}

export async function userRoast(userInput: string) {
  const userId = getUserId()
  try {
    // First, moderate the user input
    const isInputSafe = await moderateContent(userInput)
    if (!isInputSafe) {
      return "I can't respond to that kind of language. Let's keep it clean and fun!"
    }

  const prompt = `The user tried to roast the AI with: "${userInput}"
Come up with a sharp, humorous, funny comeback that turns the tables and gives the user a playful burn. Make it clever, surprising, and light-hearted, keeping it short and snappy (1-2 sentences). Each response should be fresh and unique, giving them a reason to laugh at themselves.`

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    })

    const result = await response.json()
    const text = result.choices[0].message.content

    // Removed moderation check

    // Increment stats
    await incrementDailyStats(userId)

    return text
  } catch (error) {
    console.error('Error generating user roast response:', error)
    return "Nice try, but I'm too cool to compute a comeback right now. You get a free pass... this time."
  }
}

export async function aiRoast() {
  const userId = getUserId()
  const prompt = `Generate a creative, unexpected, and funny roast directed at the user. 
  Make it feel spontaneous and unique. Focus on common human behaviors, habits, or personality traits. 
  Keep it light-hearted and playful, but with a sharp wit. The roast should be 1-2 sentences long.`

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 100,
    })

    const result = await response.json()
    const text = result.choices[0].message.content

    // Removed moderation check

    // Increment stats
    await incrementDailyStats(userId)

    return text
  } catch (error) {
    console.error('Error generating AI roast:', error)
    return "Looks like my roast circuits are fried. You win this round, human!"
  }
}

export async function fetchDailyStats() {
  return getDailyStats()
}

