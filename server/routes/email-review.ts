import express from 'express'
import 'dotenv/config'
import { GoogleGenAI } from '@google/genai'
import * as db from '../db/prompts'

const router = express.Router()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

router.post('/', async (req, res) => {
  try {
    const emailContent = req.body.emailContent
    const promptId = req.body.promptId
    const prompt = await db.getPromptById(promptId)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Review the following email for tone, clarity, effectiveness and empathy. The email is: ${emailContent}. The prompt is: ${prompt.prompt}. Return the review in markdown format.`,
    })
    res.json(response)
  } catch (error) {
    console.error('Error generating email review:', error)
    res.status(500).json({ error: 'Failed to generate email review' })
  }
})

export default router
