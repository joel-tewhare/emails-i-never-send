import express from 'express'
import * as db from '../db/time-limits'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const timeLimits = await db.getTimeLimits()
    res.json(timeLimits)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get time limits' })
  }
})

export default router
