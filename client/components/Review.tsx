import { useQuery } from '@tanstack/react-query'
import { EmailReview } from '@/models/email-review'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WordLimit } from '@/models/word-limits'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { Prompt } from '@/models/prompts'

export default function Review() {
  const [emailContent, setEmailContent] = useState<string>('')

  const handleEmailContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEmailContent(e.target.value)
  }

  const { data: emailReviewData } = useQuery<EmailReview>({
    queryKey: ['emailReview'],
    enabled: false,
  })

  const { data: promptData } = useQuery<Prompt>({
    queryKey: ['prompt'],
    enabled: false,
  })

  const { data: wordLimitData } = useQuery<WordLimit>({
    queryKey: ['wordLimit'],
    enabled: false,
  })

  if (!emailReviewData || !wordLimitData || !promptData) {
    return <div>No data available</div>
  }

  const paragraphs = emailReviewData.review.split(/\n\s*\n+/)

  return (
    <div className="min-h-screen w-full bg-email-grey p-4">
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="m-4 w-full space-y-8 md:w-80">
          <Card className="h-96 max-w-md overflow-y-auto rounded-none bg-email-charcoal text-email-white">
            <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
              <CardTitle>Here&apos;s your review,</CardTitle>
            </CardHeader>
            <ScrollArea className="text-md h-80 p-3 px-6 font-serif">
              {paragraphs.map((para, index) => (
                <p key={index} className="mb-3">
                  {para.trim()}
                </p>
              ))}
            </ScrollArea>
          </Card>
        </div>
        <div className="w-full flex-1">
          <Card className="max-w-xl overflow-y-auto rounded-none bg-email-mint">
            <CardHeader className="pl-3 pt-2">
              <CardTitle>Original email:</CardTitle>
            </CardHeader>
            <ScrollArea className="font-style: h-64 p-3 text-sm ">
              Original email content goes here...
            </ScrollArea>
          </Card>

          <Card className="max-w-xl rounded-none bg-email-white">
            <div className="flex flex-row justify-end">
              <CardContent className="flex flex-row pb-3 pl-3 pr-4 pt-2 text-sm font-bold">
                <img
                  src="/assets/images/word-limit.svg"
                  alt="word limit icon"
                  className="h-8 w-8"
                />
                <p>{wordLimitData?.wordLimit}</p>
              </CardContent>
              <CardContent className="flex flex-row pb-3 pl-3 pr-12 pt-2 text-sm font-bold">
                <img
                  src="/assets/images/time-limit.svg"
                  alt="timer icon"
                  className="h-8 w-8"
                />
              </CardContent>
            </div>
          </Card>

          <Textarea
            value={emailContent}
            onChange={handleEmailContentChange}
            className="h-80 max-w-xl px-2 py-2 text-sm"
            placeholder="Write your email here..."
          />

          <Card className="h-16 max-w-xl border-none">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                <Button
                  onClick={handleReviewEmail}
                  className="rounded-xl bg-email-mint px-4 py-3 text-email-charcoal hover:shadow-md"
                >
                  Get Review
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
