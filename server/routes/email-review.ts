import express from 'express'
import multer from 'multer'
import { GoogleGenAI } from '@google/genai'

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
    const audioFile = req.file

    if (!emailContent || !promptText) {
      return res
        .status(400)
        .json({ error: 'emailContent and promptText are required' })
    }

    //Build parts array for user's message
    const parts: Part[] = [
      {
        text: `Review the following email for tone, clarity, effectiveness and empathy. The email is: ${emailContent}. The prompt is: ${promptText}. Return like a teacher giving feedback with suggestions. No more than 250 words`,
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
    })

    const reviewText = response.text || JSON.stringify(response)

    res.json({ review: reviewText })
  } catch (error) {
    console.error('Error generating review:', error)
    res.status(500).json({ error: 'Failed to generate review' })
  }
})

export default router
