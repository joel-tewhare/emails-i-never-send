import { Prompt, PromptTextOnly } from '@/models/prompts'
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

export async function getPromptById(promptId: number): Promise<PromptTextOnly> {
  const prompt = await db('prompts')
    .where({ id: promptId })
    .select('id', 'prompt')
    .first()
  return prompt
}
