import request from 'superagent'
import { EmailReview } from '@/models/email-review'
import type { SetupAnswers } from '@/models/setup'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getEmailReview(
  emailContent: string,
  promptText: string,
  audioBlob: Blob | null,
  wordLimit: number,
  setupAnswers: SetupAnswers | null,
  groundingDoc: string | null,
): Promise<EmailReview> {
  const form = new FormData()
  form.append('emailContent', emailContent)
  form.append('promptText', promptText)
  form.append('wordLimit', String(wordLimit))

  if (setupAnswers) {
    form.append('setupAnswers', JSON.stringify(setupAnswers))
  }

  if (groundingDoc && groundingDoc.trim().length > 0) {
    form.append('groundingDoc', groundingDoc.trim())
  }

  if (audioBlob) {
    //extension is browser-based, variable checks possible types and adds to form with webm as default
    const extension = audioBlob.type.includes('webm')
      ? 'webm'
      : audioBlob.type.includes('mp4')
        ? 'mp4'
        : audioBlob.type.includes('aac') || audioBlob.type.includes('m4a')
          ? 'm4a'
          : 'webm'
    form.append('audio', audioBlob, `voice-note.${extension}`)
  }

  const response = await request.post(`${rootURL}/email-review`).send(form)
  return response.body
}
