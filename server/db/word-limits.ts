import { WordLimit } from '@/models/word-limits'
import db from '../db/connection'

export async function getWordLimits(): Promise<WordLimit[]> {
  const wordLimits = await db('word_limits').select(
    'id',
    'word_limit as wordLimit',
  )
  return wordLimits
}
