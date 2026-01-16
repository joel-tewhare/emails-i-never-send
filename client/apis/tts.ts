const rootURL = new URL(`/api/v1`, document.body.baseURI)

export async function generateTtsAudio(reviewText: string): Promise<Blob> {
  const res = await fetch(`${rootURL}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: reviewText }),
  })

  if (!res.ok) {
    throw new Error('Failed to generate TTS audio')
  }

  const buf = await res.arrayBuffer()
  const blob = new Blob([buf], { type: 'audio/wav' })
  return blob
}
