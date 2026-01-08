import { TimeLimit } from '@/models/time-limits'
import db from '../db/connection'

export async function getTimeLimits(): Promise<TimeLimit[]> {
  const timeLimits = await db('time_limits').select(
    'id',
    'time_limit as timeLimit',
  )
  return timeLimits
}
