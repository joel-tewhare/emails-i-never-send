import { Card, CardContent } from '@/components/ui/card'
import { getSavedEmails } from '../apis/saved-emails'
import { useQuery } from '@tanstack/react-query'

export default function SavedEmails() {
  const userId = 1 //hardcoded until auth0 setup

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
    </div>
  )
}
