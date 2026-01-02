import request from 'superagent'
import { TimeLimit } from '@/models/time-limits'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getTimeLimits(): Promise<TimeLimit[]> {
  const response = await request.get(`${rootURL}/time-limits`)
  return response.body
}
