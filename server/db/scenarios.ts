import { Scenario } from '@/models/scenarios'
import db from '../db/connection'

export async function getScenarios(): Promise<Scenario[]> {
  const scenarios = await db('scenarios').select('*')
  return scenarios
}
