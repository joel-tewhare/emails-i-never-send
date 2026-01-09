import request from 'superagent'
import { SavedEmail } from '@/models/saved-emails'

const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function getSavedEmails(userId: number): Promise<SavedEmail[]> {
  const response = await request
    .get(`${rootURL}/saved-emails`)
    .query({ userId }) //fetch by query rather than url param
  return response.body
}

//RESTful principle to consider: collection filtering vs resource identification
//Also extensibility: if we want to add more filters in the future, we can add them to the query params
