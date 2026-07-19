import { useMemo, useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Ambient signature element: a field of drifting, twinkling stars connected
// by faint pathway lines that fade in and out, echoing the "career pathway"
// concept behind the product. Reacts subtly to the cursor for a living,
// spacious feel. Pure visuals — no sound, no layout impact.
export default function ConstellationField({ density = 40, className = '', parallax = true }) {
  const stars = useMemo(() => {
    const arr = []
    for (let i = 0; i < density; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.5 + 0.5,
        dur: Math.random() * 5 + 5,
        delay: Math.random() * 5,
        dx: (Math.random() - 0.5) * 7,
        dy: (Math.random() - 0.5) * 7,
      })
    }
    return arr
  }, [density])

  const lines = useMemo(() => {
    const arr = []
    for (let i = 0; i < stars.length; i++) {
      const next = stars[(i + 7) % stars.length]
      if (Math.random() > 0.8) {
        arr.push({
          id: `${i}-line`,
          a: stars[i],
          b: next,
          dur: Math.random() * 4 + 5,
          delay: Math.random() * 5,
        })
      }
    }
    return arr
  }, [stars])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 35, damping: 18 })
  const sy = useSpring(my, { stiffness: 35, damping: 18 })

  useEffect(() => {
    if (!parallax) return
    const handler = (e) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * -3)
      my.set((e.clientY / window.innerHeight - 0.5) * -3)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mx, my, parallax])

  return (
    <motion.svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={parallax ? { x: sx, y: sy } : undefined}
    >
      <defs>
        <filter id="starGlow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="0.7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {lines.map((l) => (
        <motion.line
          key={l.id}
          x1={l.a.x}
          y1={l.a.y}
          x2={l.b.x}
          y2={l.b.y}
          stroke="#8B7FF5"
          strokeWidth="0.08"
          initial={{ opacity: 0.04 }}
          animate={{ opacity: [0.04, 0.3, 0.04] }}
          transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {stars.map((s) => (
        <motion.circle
          key={s.id}
          r={s.r}
          fill={s.id % 6 === 0 ? '#C4BDFB' : s.id % 9 === 0 ? '#F0A93C' : '#EAE6DA'}
          filter="url(#starGlow)"
          initial={{ opacity: 0.35, cx: s.x, cy: s.y }}
          animate={{
            opacity: [0.3, 1, 0.3],
            cx: [s.x, s.x + s.dx, s.x],
            cy: [s.y, s.y + s.dy, s.y],
          }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.svg>
  )
}
