import express from 'express'
import * as db from '../db/scenarios'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const scenarios = await db.getScenarios()
    res.json(scenarios)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get scenarios' })
  }
})

export default router
