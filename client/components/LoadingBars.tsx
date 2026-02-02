import { motion } from 'framer-motion'

const BAR_COLORS = [
  { bg: 'bg-email-blue', glow: '#4F8CFF' }, // #4F8CFF
  { bg: 'bg-email-mauve', glow: '#C08CCF' }, // #C08CCF
  { bg: 'bg-email-gold', glow: '#FFC857' }, // #FFC857
  { bg: 'bg-email-mint', glow: '#6FD3C1' }, // #6FD3C1
] as const

const BAR_DURATION = 0.3
const BAR_OVERLAP = 0.1
const TOTAL_LOOP = BAR_DURATION * 4 - BAR_OVERLAP * 3

interface LoadingBarsProps {
  className?: string
  barHeight?: number
  barWidth?: number
  gap?: number
}

export default function LoadingBars({
  className = '',
  barHeight = 48,
  barWidth = 144,
  gap = 4,
}: LoadingBarsProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex flex-col" style={{ gap: `${gap}px` }}>
        {BAR_COLORS.map((color, index) => {
          const delay = index * (BAR_DURATION - BAR_OVERLAP)

          return (
            <motion.div
              key={index}
              className={`${color.bg} rounded-sm`}
              style={{
                width: `${barWidth}px`,
                height: `${barHeight}px`,
              }}
              animate={{
                opacity: [0.9, 1, 0.9],
                scaleX: [1, 1.02, 1],
                boxShadow: [
                  `0 0 0px ${color.glow}40`,
                  `0 0 12px ${color.glow}80, 0 0 6px ${color.glow}60`,
                  `0 0 0px ${color.glow}40`,
                ],
              }}
              transition={{
                duration: BAR_DURATION,
                delay: delay,
                repeat: Infinity,
                repeatDelay: TOTAL_LOOP - BAR_DURATION,
                ease: [0.4, 0, 0.6, 1],
                times: [0, 0.5, 1],
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
