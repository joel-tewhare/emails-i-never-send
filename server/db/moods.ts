import { Mood } from '@/models/moods'
import db from '../db/connection'

export async function getMoods(): Promise<Mood[]> {
  const moods = await db('moods').select('*')
  return moods
}
