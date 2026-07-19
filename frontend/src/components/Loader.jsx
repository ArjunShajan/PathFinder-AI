import { motion } from 'framer-motion'

export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 text-paper/70">
      <div className="relative h-14 w-14">
        <motion.span
          className="absolute inset-0 rounded-full bg-gold/20 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-gold"
            style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4 + i * 0.3, ease: 'linear' }}
          />
        ))}
      </div>
      <motion.p
        className="font-mono text-xs uppercase tracking-widest"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
      >
        {label}
      </motion.p>
    </div>
  )
}
