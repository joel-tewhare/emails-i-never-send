import express from 'express'
import * as db from '../db/moods'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const moods = await db.getMoods()
    res.json(moods)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get moods' })
  }
})

export default router
