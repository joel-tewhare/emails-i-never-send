import express from 'express'
import { GoogleGenAI } from '@google/genai'

const router = express.Router()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

// Wrap PCM (16-bit LE) into WAV so the browser can play it
function pcmToWav(pcm: Buffer, sampleRate = 24000, channels = 1): Buffer {
  const bitsPerSample = 16
  const byteRate = (sampleRate * channels * bitsPerSample) / 8
  const blockAlign = (channels * bitsPerSample) / 8

  const header = Buffer.alloc(44)
  header.write('RIFF', 0)
  header.writeUInt32LE(36 + pcm.length, 4)
  header.write('WAVE', 8)
  header.write('fmt ', 12)
  header.writeUInt32LE(16, 16)
  header.writeUInt16LE(1, 20) // PCM
  header.writeUInt16LE(channels, 22)
  header.writeUInt32LE(sampleRate, 24)
  header.writeUInt32LE(byteRate, 28)
  header.writeUInt16LE(blockAlign, 32)
  header.writeUInt16LE(bitsPerSample, 34)
  header.write('data', 36)
  header.writeUInt32LE(pcm.length, 40)

  return Buffer.concat([header, pcm])
}

router.post('/', async (req, res) => {
  try {
    const { text, voiceName = 'Kore' } = req.body as {
      text?: string
      voiceName?: string
    }

    if (!text?.trim()) {
      return res.status(400).json({ error: 'text is required' })
    }

    const ttsResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    })

    const b64 =
      ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data

    if (!b64) {
      return res
        .status(500)
        .json({ error: 'No audio returned from Gemini TTS' })
    }

    const pcm = Buffer.from(b64, 'base64')
    const wav = pcmToWav(pcm, 24000, 1)

    res.setHeader('Content-Type', 'audio/wav')
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).send(wav)
  } catch (error) {
    console.error('Error generating TTS:', error)
    return res.status(500).json({ error: 'Failed to generate TTS audio' })
  }
})

export default router
