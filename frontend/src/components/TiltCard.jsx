import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Wraps any card content with a subtle, cursor-reactive 3D tilt — the
// "magnetic" hover feel used across the feature grid. Resets smoothly on
// mouse leave. No sound, no external state, purely a hover interaction.
export default function TiltCard({ children, className = '' }) {
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 220,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), {
    stiffness: 220,
    damping: 22,
  })
  const glowX = useTransform(px, [-0.5, 0.5], ['20%', '80%'])
  const glowY = useTransform(py, [-0.5, 0.5], ['20%', '80%'])

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group relative ${className}`}
    >
      {/* Cursor-following glow, revealed on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(240,169,60,0.14), transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  )
}
