import { Prompt } from '@/models/prompts'
import db from '../db/connection'

export async function getPrompts(
  scenarioId: number,
  moodId: number,
): Promise<Prompt[]> {
  const prompts = await db('prompts')
    .where({ scenario_id: scenarioId, mood_id: moodId })
    .select('id', 'scenario_id as scenarioId', 'mood_id as moodId', 'prompt')
  return prompts
}
