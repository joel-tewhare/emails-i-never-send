import express from 'express'
import { GoogleGenAI } from '@google/genai'

const router = express.Router()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

router.post('/', async (req, res) => {
  try {
    const emailContent = req.body.emailContent
    const promptText = req.body.promptText
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Review the following email for tone, clarity, effectiveness and empathy. The email is: ${emailContent}. The prompt is: ${promptText}. Return like a teacher giving feedback with suggestions. No more than 250 words`,
    })

    // Extract the text from the Google GenAI response
    // The response structure may vary - adjust based on actual API response
    const reviewText = response.text || JSON.stringify(response)

    res.json({ review: reviewText })
  } catch (error) {
    console.error('Error generating review:', error)
    res.status(500).json({ error: 'Failed to generate review' })
  }
})

export default router
