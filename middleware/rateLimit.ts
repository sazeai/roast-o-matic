import { NextApiRequest, NextApiResponse } from 'next'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 100 requests per windowMs
  message: "Whoa there, hotshot! You're roasting faster than our servers can handle. Cool off and come back with sharper comebacks!",
  standardHeaders: true,
  legacyHeaders: false,
})

export default function rateLimitMiddleware(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  return new Promise((resolve, reject) => {
    limiter(req, res, (result: Error | undefined) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(next())
    })
  })
}

