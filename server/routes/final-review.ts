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
        {text: `You will receive:
          - the original email draft (text)
          - the text of the original review
          - the rewritten email (text)
          - prompt context (scenario + any constraints)
          
          This is the FINAL review for the rewrite. Keep feedback concise and actionable.
          
          First, give an IMPACT RATING for the rewritten email as a percentage (0–100). This must be the first line of your response in the format:
          Impact rating: XX%
          
          Then provide:
          1) Percent change from the original impactrating (positive or negative) in the format:
          Change from original: +X% (or -X%)
          If the original rating number is not provided, leave impact rating out of this review.
          
          Then briefly review the rewritten email for tone, clarity, effectiveness, and empathy in the context of the prompt.
          
          Focus on:
          - Whether the rewrite better matches the intended outcome of the scenario
          - What improved compared to the original (be specific)
          - Any remaining weak spots that would most improve the impact if adjusted
          
          Provide:
          - 2–4 short, concrete suggestions (no heavy formatting)
          - Optional micro-rewrites for 1–2 key sentences only where helpful (do not provide a full rewrite)
          
          Write in a calm, conversational, supportive tone that would sound natural when read aloud using text-to-speech.
          Avoid heavy formatting, excessive bullet points, or long nested lists.
          Do not separate “original vs suggested” as blocks—keep suggestions inside full sentences.
          Do not offer a full rewrite of the email.
          
          Keep the entire response under 200 words (this is a final check, not a full coaching session).
          
          ORIGINAL EMAIL:
          ${emailOriginal}

          FIRST REVIEW WITH ORIGINAL IMPACT RATING:
          ${reviewText}
          
          REWRITTEN EMAIL:
          ${emailRewrite}
          
          PROMPT CONTEXT:
          ${promptText}`.trim()}],
    })
    const finalReviewText = response.text || JSON.stringify(response)
  res.json({ finalReview: finalReviewText, promptText, reviewText, emailRewrite })
  } catch (error) {
    console.error('Error fetching final review:', error)
    res.status(500).json({ error: 'Failed to get final review' })
  }
})

export default router