import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import rateLimitMiddleware from '../middleware/rateLimit'

export function withRateLimit(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await rateLimitMiddleware(req, res, () => {})
      return handler(req, res)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(429).json({ error: error.message })
      }
      return res.status(429).json({ error: 'Too many requests' })
    }
  }
}

