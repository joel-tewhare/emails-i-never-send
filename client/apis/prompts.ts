import request from 'superagent'
import { Prompt } from '@/models/prompts'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getPrompts(
  scenarioId: number,
  moodId: number,
): Promise<Prompt[]> {
  const response = await request
    .get(`${rootURL}/prompts`)
    .query({ scenarioId, moodId })
  return response.body
}

export async function getPromptById(promptId: number): Promise<Prompt> {
  const response = await request.get(`${rootURL}/prompts/${promptId}`)
  return response.body
}
