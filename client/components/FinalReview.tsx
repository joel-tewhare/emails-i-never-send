import { useMutation, useQuery } from "@tanstack/react-query"
import { generateTtsAudio } from "../apis/tts"
import { useEffect, useRef, useState } from "react"
import { FinalReview } from "@/models/final-review"
import { Play } from "lucide-react"

export default function RewriteReview() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const {data: finalReviewData} = useQuery<FinalReview>({
    queryKey: ['finalReview'],
    enabled: false,
  })

  //second use of mutation - can this be refactored to helper function?
  const ttsMutation = useMutation({
    mutationFn: (text: string) => generateTtsAudio(text),
    onSuccess: (audioBlob) => {
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      // Auto-play when audio is ready
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.play()
      }
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
    if (!finalReviewData?.finalReview) return

    if (audioUrl && audioRef.current) {
      // If audio already generated, just play it
      audioRef.current.play()
    } else {
      // Generate new audio
      ttsMutation.mutate(finalReviewData.finalReview)
    }
  }

  
  return (
    <div className="flex flex-col items-center gap-4 pb-4">
    <button
      onClick={handlePlayTts}
      disabled={ttsMutation.isPending}
      className="flex h-16 w-16 items-center justify-center rounded-full bg-email-white text-email-charcoal hover:bg-email-white/80 disabled:opacity-50"
      aria-label="Play audio review"
    >
      {ttsMutation.isPending ? (
        <span className="text-sm">...</span>
      ) : (
        <Play className="h-8 w-8" fill="currentColor" />
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
  </div>)
}