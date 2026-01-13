import request from 'superagent'
import { EmailReview } from '@/models/email-review'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getEmailReview(
  emailContent: string,
  promptId: number,
): Promise<EmailReview> {
  const response = await request
    .post(`${rootURL}/email-review`)
    .send({ emailContent, promptId })
  return response.body
}
