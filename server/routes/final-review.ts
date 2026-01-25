import express from 'express'
import { GoogleGenAI } from '@google/genai'
import { rewriteSystemInstruction } from '../gemini/rewriteSystemInstruction'
import { rewriteSchema } from '../gemini/rewriteSchema'
import toCamelCase from '../utils'

const router = express.Router()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

type Part = { text: string }

type Content = {
  role: 'user' | 'model'
  parts: Part[]
}

router.post('/', async (req, res) => {
  try {
    const originalEmailContent = req.body.originalEmailContent
    const originalImpactRatingPercent = req.body.originalImpactRatingPercent
    const finalEmailContent = req.body.finalEmailContent
    const promptText = req.body.promptText

    if (!originalEmailContent || !finalEmailContent || !promptText) {
      return res.status(400).json({ error: 'Required data is missing' })
    }

    //Build parts array for user's message
    const parts: Part[] = [
      {
        text: `
ORIGINAL EMAIL:
${originalEmailContent}

ORIGINAL IMPACT RATING PERCENT:
${originalImpactRatingPercent ?? null}

FINAL EMAIL:
${finalEmailContent}

PROMPT CONTEXT:
${promptText}
`.trim(),
      },
    ]

    //Contents array with role and parts
    const contents: Content[] = [
      {
        role: 'user',
        parts: parts,
      },
    ]

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: rewriteSystemInstruction,
        responseSchema: rewriteSchema,
        temperature: 0.4,
        maxOutputTokens: 8192, // Increased for comprehensive reviews
      },
    })

    const raw = response.text
    if (!raw) {
      return res.status(502).json({
        error: 'No response from AI',
      })
    }

    let reviewJson: unknown
    try {
      reviewJson = JSON.parse(raw)
    } catch {
      return res.status(502).json({
        error: 'Invalid JSON response from AI',
        rawResponse: raw,
      })
    }

    // Transform snake_case to camelCase to match model type
    const formattedReview = toCamelCase(reviewJson)

    res.json({
      reviewData: formattedReview,
      emailOriginal: originalEmailContent,
      finalEmail: finalEmailContent,
      promptText,
    })
  } catch (error) {
    console.error('Error generating review:', error)
    res.status(500).json({ error: 'Failed to generate review' })
  }
})

export default router
