import { Router } from 'express'
import * as db from '../db/users'

const router = Router()

router.get('/', async (req, res) => {
  const authId = 'auth0|f83bd9a2c1e54723a4d29f01' //hardcoded for now
  if (!authId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const user = await db.getUserByAuthId(authId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user' })
  }
})

export default router

//TO DO: setup auth0 and refactor function
