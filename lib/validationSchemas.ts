import { z } from 'zod'

export const roastSchema = z.object({
  roastTarget: z.string().min(1).max(100),
  theme: z.enum(['gamer', 'work', 'sibling', 'random', 'tech-nerd', 'foodie', 'fitness-freak', 'social-media-addict']),
  level: z.enum(['mild-toast', 'medium-burn', 'crispy-roast', 'sizzling-burn', 'extra-spicy', 'savage-flame', 'nuclear-roast']),
})

export const userRoastSchema = z.object({
  userInput: z.string().min(1).max(200),
})

