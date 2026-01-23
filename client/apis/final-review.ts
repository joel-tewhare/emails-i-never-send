import request from 'superagent'
import { FinalReview } from '@/models/final-review'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getFinalReview(
  emailOriginal: string,
  promptText: string,
  emailRewrite: string,
  originalImpactRatingPercent: number | null,
): Promise<FinalReview> {
  const response = await request.post(`${rootURL}/final-review`).send({
    emailOriginal,
    promptText,
    emailRewrite,
    originalImpactRatingPercent,
  })
  return response.body
}
