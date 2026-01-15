import request from 'superagent'
import { EmailReview } from '@/models/email-review'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getEmailReview(
  emailContent: string,
  promptText: string,
  audioBlob: Blob | null,
): Promise<EmailReview> {
  const response = await request
    .post(`${rootURL}/email-review`)
    .send({ emailContent, promptText, audioBlob })
  return response.body
}
