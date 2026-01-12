import { User } from '@/models/users'
import db from './connection'

export async function getUserByAuthId(
  authId: string,
): Promise<User | undefined> {
  const user = await db('users').where({ auth_id: authId }).first()
  if (!user) return undefined
  return {
    id: user.id,
    authId: user.auth_id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
  }
}
