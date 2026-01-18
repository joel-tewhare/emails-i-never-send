import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EmailReview } from '@/models/email-review'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { getEmailRewriteReview } from '../apis/email-rewrite'
import { generateTtsAudio } from '../apis/tts'
import { ArrowBigDownDash, AudioLines} from 'lucide-react'

export default function Review() {
  const [emailRewrite, setEmailRewrite] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleEmailRewriteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEmailRewrite(e.target.value)
  }

  const { data: emailReviewData } = useQuery<EmailReview>({
    queryKey: ['emailReview'],
    enabled: false,
  })

  const ttsMutation = useMutation({
    mutationFn: (text: string) => generateTtsAudio(text),
    onSuccess: (audioBlob) => {
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    },
  })

  useEffect(() => {
    const reviewText = emailReviewData?.review
    if (!reviewText) return //text doesn't exist
    if (audioUrl) return //audio is already generated
    if (ttsMutation.isPending) return //audio is being generated

    ttsMutation.mutate(reviewText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailReviewData?.review, audioUrl, ttsMutation.isPending])

  const rewriteReviewMutation = useMutation({
    mutationFn: ({
      emailRewrite,
      promptText,
      emailOriginal,
    }: {
      emailRewrite: string
      promptText: string
      emailOriginal: string
    }) => getEmailRewriteReview(emailRewrite, promptText, emailOriginal),
    onSuccess: (data) => {
      queryClient.setQueryData(['emailRewrite'], data)
      navigate('/final')
    },
  })

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const handlePlayTts = () => {
    if (!audioRef.current) return
      // If audio already generated, just play it
      audioRef.current.play()
  }

  const handleRewriteReview = () => {
    if (emailReviewData && emailRewrite !== '') {
      rewriteReviewMutation.mutate({
        emailRewrite,
        promptText: emailReviewData.promptText,
        emailOriginal: emailReviewData.emailOriginal,
      })
    }
  }

  if (!emailReviewData) {
    return <div>Missing review data</div>
  }

  const reviewParagraphs = emailReviewData?.review.split(/\n\s*\n+/)
  const originalParagraphs = emailReviewData?.emailOriginal.split(/\n\s*\n+/)

  const isReviewPending = rewriteReviewMutation.isPending

  return (
    <div className="relative min-h-screen w-full bg-email-grey p-4">
      {isReviewPending && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-email-grey/60">
        <p className="text-email-charcoal">Getting your final review...</p>
        </div>)}

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 md:flex-row">
        <div className="m-4 flex w-full flex-col space-y-4 md:w-96">
          <Card className="h-64 max-w-md rounded-none border-2 border-dashed border-email-charcoal bg-email-white p-4 text-email-charcoal">
            <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
              <CardTitle className="mb-4 text-center">
              {!audioUrl && ttsMutation.isPending && (
                  <span className="text-sm text-email-charcoal/80">Loading review audio…</span>
                )}

                {!audioUrl && ttsMutation.isError && (
                  <span>Couldn&apos;t generate audio. See review notes below</span>)}

                {audioUrl && (
                <span>Listen to your review:</span>
                )}
              </CardTitle>
              <div className="flex flex-col items-center gap-4 pb-4">
                <button
                  onClick={handlePlayTts}
                  disabled={ttsMutation.isPending}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-email-white text-email-charcoal hover:bg-email-white/80 disabled:opacity-50"
                  aria-label="Play audio review"
                >
                  {ttsMutation.isPending && (
                    <span className="text-lg font-bold">...</span>
                  )}

                  {audioUrl && (
                    <AudioLines
                      className="h-8 w-8"
                      fill="email-charcoal"
                    />
                  )}

                  {!audioUrl || ttsMutation.isError && (
                    <ArrowBigDownDash className="h-8 w-8" fill="email-charcoal" />
                  )}
                </button>
                {audioUrl && (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    controls
                    className="w-full"
                  />
                )}
              </div>
            </CardHeader>
          </Card>

          <Card className="h-[40rem] max-w-md overflow-y-auto rounded-none bg-email-white text-email-charcoal">
            <CardHeader className="justify-center pl-3 pt-4 font-serif text-lg">
              <CardTitle className="mb-3 mt-2 text-center">
                Transcript
              </CardTitle>
            </CardHeader>
            <ScrollArea className="h-[40rem] p-3 px-6 font-serif text-[15px] leading-relaxed md:h-[calc(100vh-14rem)]">
              {reviewParagraphs.map((para, index) => (
                <p key={index} className="mb-3">
                  {para.trim()}
                </p>
              ))}
            </ScrollArea>
          </Card>
        </div>
        <div className="w-full flex-1">
          <Card className="mb-8 max-w-xl bg-email-white p-3">
            <CardHeader className="pl-3 pt-2 font-serif">
              <CardTitle className="text-xl italic">Prompt:</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pl-3 pt-2 font-serif text-lg">
              {emailReviewData?.promptText}
            </CardContent>
          </Card>

          <Card className="mb-8 max-w-xl overflow-y-auto rounded-none bg-email-mint">
            <CardHeader className="pl-3 pt-2">
              <CardTitle>Original email:</CardTitle>
            </CardHeader>
            <ScrollArea className="font-style: h-64 p-3 text-sm ">
              {originalParagraphs.map((para, index) => (
                <p key={index} className="mb-3">
                  {para.trim()}
                </p>
              ))}
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
                <p>{Number(emailReviewData?.wordLimit)}</p>
              </CardContent>
            </div>
          </Card>

          <Textarea
            value={emailRewrite}
            onChange={handleEmailRewriteChange}
            className="h-80 max-w-xl px-2 py-2 text-sm"
            placeholder="Rewrite your email here..."
          />

          <Card className="h-16 max-w-xl border-none">
            <div className="flex h-full flex-row items-center justify-end">
              <CardContent className="pr-6 pt-2 text-sm font-bold">
                <Button
                  onClick={handleRewriteReview}
                  className="rounded-xl bg-email-mint px-4 py-3 text-email-charcoal hover:shadow-md"
                >
                  Get Final Review
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
