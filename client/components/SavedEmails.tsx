import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEmailById, getSavedEmails } from '../apis/saved-emails'
import { getPromptById } from '../apis/prompts'
import { useQuery } from '@tanstack/react-query'
import { formatDate, getScenarioColor } from '@/lib/utils'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

export default function SavedEmails() {
  const userId = 1 //hardcoded until auth0 setup

  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null)
  const [selectedEmailText, setSelectedEmailText] = useState<string | null>(
    null,
  )

  const { data, isPending, error } = useQuery({
    queryKey: ['emails'],
    queryFn: () => getSavedEmails(userId),
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading data</div>
  }

  if (!data) {
    return <div>No data available</div>
  }

  const handleGetEmailData = async (promptId: number, emailId: number) => {
    const selectedPrompt = await getPromptById(promptId)
    setSelectedPrompt(selectedPrompt.prompt)

    const selectedEmail = await getEmailById(emailId)
    setSelectedEmailText(selectedEmail.content)
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card className="max-w-xxl m-4 rounded-none border-none bg-email-white">
        <div className="flex flex-row justify-center">
          <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
            <div className="h-4 w-4 rounded-sm bg-email-blue"></div>
            <p>Work</p>
          </CardContent>
          <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
            <div className="h-4 w-4 rounded-sm bg-email-gold"></div>
            <p>Relationships</p>
          </CardContent>
          <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
            <div className="h-4 w-4 rounded-sm bg-email-mauve"></div>
            <p>Customer Service</p>
          </CardContent>
          <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
            <div className="h-4 w-4 rounded-sm bg-email-mint"></div>
            <p>Emotional Honesty</p>
          </CardContent>
          <CardContent className="flex flex-row space-x-2 p-3 text-sm font-bold">
            <div className="h-4 w-4 rounded-sm border border-email-charcoal/50 bg-email-white"></div>
            <p>Conflict Resolution</p>
          </CardContent>
        </div>
      </Card>

      <div className="flex w-full flex-row flex-wrap items-center justify-center">
        <Card className="h-2xl m-2 max-w-md overflow-y-auto rounded-none bg-email-white text-email-charcoal">
          <CardHeader className="py-6 pl-3 text-center text-lg font-bold">
            <CardTitle>SAVED EMAILS</CardTitle>
          </CardHeader>
          <div className="w-full">
            {data.map((email) => (
              <button
                onClick={() => handleGetEmailData(email.promptId, email.id)}
                key={email.id}
                className={`w-full rounded-sm p-3 text-left ${getScenarioColor(email.scenarioId)}`}
              >
                <p className="font-bold">{formatDate(email.createdAt)}</p>
                <p>{email.content.slice(0, 100)}...</p>
              </button>
            ))}
          </div>
        </Card>

        <div className="m-2 flex w-full max-w-xl flex-col items-center">
          <Card className="mb-8 w-full bg-email-white">
            <CardHeader className="pl-3 pt-2 font-serif">
              <CardTitle>Prompt was:</CardTitle>
            </CardHeader>
            <CardContent className="min-h-[110px] pb-3 pl-3 pt-2 font-serif text-xl italic">
              {selectedPrompt || 'No prompt selected'}
            </CardContent>
          </Card>

          <Textarea
            value={selectedEmailText || 'No email selected'}
            className="text-md h-80 w-full px-2 py-2"
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
