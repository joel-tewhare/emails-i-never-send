type LikelihoodBarProps = {
  value: number
}

export default function LikelihoodBar({ value }: LikelihoodBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))

  return (
    <div
      className="h-2.5 w-28 min-w-[5rem] rounded-full bg-emerald-500/30 shadow-sm"
      role="progressbar"
      aria-label="Estimated likelihood of a constructive outcome"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-emerald-500"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  )
}
