import { useState } from 'react'
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder'

type RecorderStatus = 'idle' | 'recording' | 'finalizing' | 'recorded' | 'error'

export default function VoiceNote() {
  const [audio, setAudio] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [recorderStatus, setRecorderStatus] = useState<RecorderStatus>('idle')
  const [remainingSeconds, setRemainingSeconds] = useState<number>(20)

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (error) => console.error('Error initializing recorder:', error),
  )
  const addAudioElement = (blob: Blob) => {
    setAudio(blob)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(URL.createObjectURL(blob))
    setRecorderStatus('recorded')
  }

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        showVisualizer={true}
      />
      <button onClick={recorderControls.stopRecording}>Stop Recording</button>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      {previewUrl && <audio src={previewUrl} controls />}
    </div>
  )
}
