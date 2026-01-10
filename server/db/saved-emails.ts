import { SavedEmail } from '@/models/saved-emails'
import db from '../db/connection'

export async function getSavedEmails(userId: number): Promise<SavedEmail[]> {
  const savedEmails = await db('saved_emails')
    .join('prompts', 'saved_emails.prompt_id', 'prompts.id')
    .where({ user_id: userId })
    .select(
      'saved_emails.id as id',
      'saved_emails.user_id as userId',
      'saved_emails.prompt_id as promptId',
      'prompts.scenario_id as scenarioId',
      'saved_emails.content as content',
      'saved_emails.created_at as createdAt',
    )
  return savedEmails
}
