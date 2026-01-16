"use client"

import * as React from "react"
import confetti from "canvas-confetti"

interface ConfettiCelebrationProps {
  trigger: boolean
  color?: string
}

export function ConfettiCelebration({ trigger, color  }: ConfettiCelebrationProps) {
  React.useEffect(() => {
    if (trigger) {
      // Fire confetti
      const count = 200
      const defaults = {
        origin: { y: 0.7 },
        colors: ["#0D47A1", "#1565C0", "#1E88E5", "#42A5F5", "#90CAF9","#37474F"]

      }

      function fire(particleRatio: number, opts: confetti.Options) {
        const confettiFn = confetti as unknown as (options: confetti.Options) => void
        confettiFn({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        })
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      })

      fire(0.2, {
        spread: 60,
      })

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      })

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      })
    }
  }, [trigger, color])

  return null 
}
