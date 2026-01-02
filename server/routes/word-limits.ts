import express from 'express'
import * as db from '../db/word-limits'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const wordLimits = await db.getWordLimits()
    res.json(wordLimits)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get word limits' })
  }
})

export default router
