import request from 'superagent'
import { SavedEmail, SavedEmailText } from '@/models/saved-emails'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getSavedEmails(userId: number): Promise<SavedEmail[]> {
  const response = await request
    .get(`${rootURL}/saved-emails`)
    .query({ userId })
  return response.body
}

export async function getEmailById(emailId: number): Promise<SavedEmailText> {
  const response = await request.get(`${rootURL}/saved-emails/${emailId}`)
  return response.body
}
