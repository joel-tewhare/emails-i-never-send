import request from 'superagent'
import { Mood } from '@/models/moods'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getMoods(): Promise<Mood[]> {
  const response = await request.get(`${rootURL}/moods`)
  return response.body
}
