import request from 'superagent'
import { EmailRewrite } from '@/models/email-rewrite'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getEmailRewriteReview(
  emailRewrite: string,
  promptText: string,
  emailOriginal: string,
): Promise<EmailRewrite> {
  const response = await request
    .post(`${rootURL}/email-rewrite`)
    .send({ emailRewrite, promptText, emailOriginal })
  return response.body
}
