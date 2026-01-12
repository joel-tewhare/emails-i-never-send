import { User } from '@/models/users'
import db from './connection'

export async function getUserByAuthId(
  authId: string,
): Promise<User | undefined> {
  const user = await db('users')
    .where({ auth_id: authId })
    .select('id', 'auth_id', 'username', 'first_name', 'last_name')
    .first()
  if (!user) return undefined
  return
}
