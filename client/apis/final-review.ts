import request from 'superagent'
import { FinalReview } from '@/models/final-review'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getFinalReview(
  emailOriginal: string,
  promptText: string,
  reviewText: string,
  emailRewrite: string,
): Promise<FinalReview> {
  const response = await request.post(`${rootURL}/final-review`).send({ emailOriginal, promptText, reviewText, emailRewrite })
  return response.body
}