import express from 'express'
import * as Path from 'node:path'

import scenariosRoutes from './routes/scenarios.ts'
import moodsRoutes from './routes/moods.ts'
import wordLimitsRoutes from './routes/word-limits.ts'
import timeLimitsRoutes from './routes/time-limits.ts'
import promptsRoutes from './routes/prompts.ts'
import savedEmailsRoutes from './routes/saved-emails.ts'
import usersRoutes from './routes/users.ts'
import emailReviewRoutes from './routes/email-review.ts'
import finalReviewRoutes from './routes/final-review.ts'
import ttsRoutes from './routes/tts.ts'

const server = express()

server.use(express.json())

server.use('/api/v1/scenarios', scenariosRoutes)
server.use('/api/v1/moods', moodsRoutes)
server.use('/api/v1/word-limits', wordLimitsRoutes)
server.use('/api/v1/time-limits', timeLimitsRoutes)
server.use('/api/v1/prompts', promptsRoutes)
server.use('/api/v1/saved-emails', savedEmailsRoutes)
server.use('/api/v1/users', usersRoutes)
server.use('/api/v1/email-review', emailReviewRoutes)
server.use('/api/v1/final-review', finalReviewRoutes)
server.use('/api/v1/tts', ttsRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
