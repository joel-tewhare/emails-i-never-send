import express from 'express'
import { GoogleGenAI } from '@google/genai'

const router = express.Router()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

router.post('/', async(req, res) => {
  try {
    const { emailOriginal, promptText, reviewText, emailRewrite } = req.body

    if (!emailOriginal || !promptText || !reviewText || !emailRewrite) {
      return res
        .status(400)
        .json({ error: 'Missing data for final review' })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {text: 'PROMPT TEXT HERE'.trim()}],
    })
    const finalReviewText = response.text || JSON.stringify(response)
  res.json({ finalReview: finalReviewText, promptText, reviewText, emailRewrite })
  } catch (error) {
    console.error('Error fetching final review:', error)
    res.status(500).json({ error: 'Failed to get final review' })
  }
})

export default router