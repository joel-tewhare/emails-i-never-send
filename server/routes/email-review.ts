import express from 'express'
import multer from 'multer'
import { GoogleGenAI } from '@google/genai'
import { systemInstruction } from '../gemini/reviewSystemInstruction'
import { reviewSchema } from '../gemini/reviewSchema'
import toCamelCase, { buildSessionContextText } from '../utils'
import { SetupAnswers } from '@/models/setup'

const router = express.Router()
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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

    let setupAnswers: SetupAnswers | undefined

    if (typeof req.body.setupAnswers === 'string') {
      try {
        setupAnswers = JSON.parse(req.body.setupAnswers)
      } catch {
        return res.status(400).json({ error: 'Invalid setupAnswers JSON' })
      }
    }

    const groundingDoc =
      typeof req.body.groundingDoc === 'string'
        ? req.body.groundingDoc
        : undefined

    const contextText = buildSessionContextText(setupAnswers, groundingDoc)

    if (!emailContent || !promptText) {
      return res.status(400).json({
        error: 'emailContent, promptText, and contextText are required',
      })
    }

    const parts: Part[] = [
      {
        text: `
${contextText ? `CONTEXT: ${contextText}\n\n` : ''}
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
        maxOutputTokens: 8192,
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
