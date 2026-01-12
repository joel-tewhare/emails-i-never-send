import request from 'superagent'
import { User } from '@/models/users'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getProfile(): Promise<User> {
  const response = await request.get(`${rootURL}/users`)
  return response.body
}
