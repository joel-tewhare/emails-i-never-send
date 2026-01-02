import request from 'superagent'
import { Scenario } from '@/models/scenarios'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getScenarios(): Promise<Scenario[]> {
  const response = await request.get(`${rootURL}/scenarios`)
  return response.body
}
