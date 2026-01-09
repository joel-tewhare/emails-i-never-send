import { SavedEmail } from '@/models/saved-emails'
import db from '../db/connection'

export async function getSavedEmails(userId: number): Promise<SavedEmail[]> {
  const savedEmails = await db('saved_emails')
    .where({ user_id: userId })
    .select(
      'id',
      'user_id as userId',
      'prompt_id as promptId',
      'content',
      'created_at as createdAt',
    )
  return savedEmails
}
