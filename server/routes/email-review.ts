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
    const wordLimit = req.body.wordLimit
    const audioFile = req.file

    if (!emailContent || !promptText) {
      return res
        .status(400)
        .json({ error: 'emailContent and promptText are required' })
    }

    //Build parts array for user's message
    const parts: Part[] = [
      {
        text: `You will receive:
- an email draft (text)
- an optional voice note (the sender explaining how they hope the recipient will feel when reading the email)

If a voice note is provided:
1. Infer the sender’s intended emotional impact from the voice note (do not transcribe it verbatim).
2. Give an impact rating out of 100 as a percentage, based on how well the email achieves the intended emotional impact described in the voice note. This should be a separate opening line at the beginning of the response.
3. Briefly note any mismatch between the intended feeling and the tone of the written email.

Then review the email draft for tone, clarity, effectiveness, and empathy.

Provide:
- Specific feedback tied to the sender’s intended emotional impact
- Concrete suggestions for improvement
- Optional example rewrites for key sentences (only where helpful)

If no voice note is provided, base feedback on the written email alone.

Write in a calm, conversational, supportive tone that would sound natural when read aloud using text-to-speech.
Avoid heavy formatting, excessive bullet points, or long nested lists.
Don't section off original and suggested text - if using, describe as part of full sentences.
Don't offer full rewrites of the email - just suggest improvements.

Encourage the user to rewrite the email taking into account the feedback provided. Let them know they can then submit their rewritten email for a final review.

Keep the entire response under 250 words, in the style of a thoughtful teacher giving constructive feedback.

EMAIL:
${emailContent}

PROMPT CONTEXT:
${promptText}

WORD LIMIT CONTEXT:
${wordLimit} words
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
    })

    const reviewText = response.text || JSON.stringify(response)

    res.json({
      review: reviewText,
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
