import express from 'express'
import * as db from '../db/saved-emails'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const userId = Number(req.query.userId)
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' })
    }
    const savedEmails = await db.getSavedEmails(userId)
    res.json(savedEmails)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get saved emails' })
  }
})

router.get('/:emailId', async (req, res) => {
  try {
    const emailId = Number(req.params.emailId)
    const email = await db.getEmailById(emailId)
    res.json(email)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get email' })
  }
})

export default router
