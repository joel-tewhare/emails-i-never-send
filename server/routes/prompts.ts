import express from 'express'
import * as db from '../db/prompts'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const scenarioId = Number(req.query.scenarioId)
    const moodId = Number(req.query.moodId)

    if (!scenarioId || !moodId) {
      return res
        .status(400)
        .json({ error: 'scenarioId and moodId are required' })
    }

    const prompts = await db.getPrompts(scenarioId, moodId)
    res.json(prompts)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    res.status(500).json({ error: 'Failed to get prompts' })
  }
})

export default router
