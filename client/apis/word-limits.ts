import request from 'superagent'
import { WordLimit } from '@/models/word-limits'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getWordLimits(): Promise<WordLimit[]> {
  const response = await request.get(`${rootURL}/word-limits`)
  return response.body
}
