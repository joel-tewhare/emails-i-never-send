import request from 'superagent'
import { FinalReview } from '@/models/final-review'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getFinalReview(
  originalEmailContent: string,
  promptText: string,
  finalEmailContent: string,
  originalImpactRatingPercent: number | null,
): Promise<FinalReview> {
  const response = await request.post(`${rootURL}/final-review`).send({
    originalEmailContent,
    promptText,
    finalEmailContent,
    originalImpactRatingPercent,
  })
  return response.body
}
