import express from 'express'
import multer from 'multer'
import { GoogleGenAI } from '@google/genai'
import { systemInstruction } from '../gemini/reviewSystemInstruction'
import { reviewSchema } from '../gemini/reviewSchema'
import toCamelCase from '../utils'

const router = express.Router()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, //10mb limit for audio
})

type TextPart = { text: string }
type VoiceNotePart = {
  inlineData: {
    mimeType: string
    data: string
  }
}
type Part = TextPart | VoiceNotePart

type Content = {
  role: 'user' | 'model'
  parts: Part[]
}

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const emailContent = req.body.emailContent
    const promptText = req.body.promptText
    const wordLimit = Number(req.body.wordLimit)
    const audioFile = req.file

    if (!emailContent || !promptText) {
      return res
        .status(400)
        .json({ error: 'emailContent and promptText are required' })
    }

    //Build parts array for user's message
    const parts: Part[] = [
      {
        text: `
EMAIL:
${emailContent}

PROMPT CONTEXT:
${promptText}

WORD LIMIT CONTEXT:
${wordLimit ?? 250} words
`.trim(),
      },
    ]

    if (audioFile) {
      const audioBase64 = audioFile.buffer.toString('base64')

      parts.push({
        inlineData: {
          mimeType: audioFile.mimetype || 'audio/webm',
          data: audioBase64,
        },
      })
    }

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
        systemInstruction,
        responseSchema: reviewSchema,
        temperature: 0.4,
        maxOutputTokens: 8192, // Increased for comprehensive reviews
      },
    })

    // Check if response was truncated
    const finishReason = response.candidates?.[0]?.finishReason
    if (finishReason === 'MAX_TOKENS') {
      console.warn('Response was truncated due to token limit')
      return res.status(502).json({
        error: 'Response was truncated. Please try with a shorter email or reduce review detail.',
        finishReason,
      })
    }

    const raw = response.text
    if (!raw) {
      console.error('No response text from Gemini API')
      console.error('Finish reason:', finishReason)
      return res.status(502).json({
        error: 'No response from AI',
        finishReason,
      })
    }

    let reviewJson: unknown
    try {
      reviewJson = JSON.parse(raw)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Raw response length:', raw.length)
      console.error('Raw response (first 500 chars):', raw.substring(0, 500))
      return res.status(502).json({
        error: 'Invalid JSON response from AI - response may be truncated',
        rawResponseLength: raw.length,
        rawResponsePreview: raw.substring(0, 500),
      })
    }

    // Transform snake_case to camelCase to match model type
    const formattedReview = toCamelCase(reviewJson)

    res.json({
      reviewData: formattedReview,
      emailOriginal: emailContent,
      promptText,
      wordLimit,
    })
  } catch (error) {
    console.error('Error generating review:', error)
    res.status(500).json({ error: 'Failed to generate review' })
  }
})

export default router
