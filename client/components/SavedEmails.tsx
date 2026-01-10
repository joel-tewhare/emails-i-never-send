import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getSavedEmails } from '../apis/saved-emails'
import { getPromptById } from '../apis/prompts'
import { useQuery } from '@tanstack/react-query'
import { formatDate, getScenarioColor } from '@/lib/utils'
import { useState } from 'react'

export default function SavedEmails() {
  const userId = 1 //hardcoded until auth0 setup

  const [selectedEmail, setSelectedEmail] = useState<string>('')

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

  const handleGetPrompt = async (promptId: number) => {
    const selected = await getPromptById(promptId)
    setSelectedEmail(selected.prompt)
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
                onClick={() => handleGetPrompt(email.promptId)}
                key={email.id}
                className={`w-full rounded-sm p-3 text-left ${getScenarioColor(email.scenarioId)}`}
              >
                <p className="font-bold">{formatDate(email.createdAt)}</p>
                <p>{email.content.slice(0, 100)}...</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="m-2 mb-8 w-full max-w-xl bg-email-white">
          <CardHeader className="pl-3 pt-2 font-serif">
            <CardTitle>Prompt was:</CardTitle>
          </CardHeader>
          <CardContent className="font-style: pb-3 pl-3 pt-2 font-serif text-xl italic">
            {selectedEmail}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
