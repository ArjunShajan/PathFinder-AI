// Fixed, decorative, animated gradient backdrop. Purely visual — no state,
// no side effects, no sound, and it sits behind everything (pointer-events
// disabled) so it never interferes with app logic or interaction.
export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Slow-rotating aurora ribbon for a living, colour-shifting sky */}
      <div
        className="absolute -inset-[20%] animate-spinSlow opacity-40 mix-blend-screen"
        style={{
          background:
            'conic-gradient(from 0deg at 50% 40%, rgba(139,127,245,0.32), rgba(99,102,241,0.22), rgba(196,189,251,0.28), rgba(139,127,245,0.32))',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="aurora-blob h-[520px] w-[520px] animate-floatSlow bg-nebula/40"
        style={{ top: '-10%', left: '-8%' }}
      />
      <div
        className="aurora-blob h-[600px] w-[600px] animate-floatSlower bg-nebula/35"
        style={{ top: '5%', right: '-12%' }}
      />
      <div
        className="aurora-blob h-[460px] w-[460px] animate-floatSlow bg-gold/15"
        style={{ bottom: '-12%', left: '20%' }}
      />
      <div
        className="aurora-blob h-[380px] w-[380px] animate-floatSlower bg-nebula/25"
        style={{ bottom: '8%', right: '8%', animationDelay: '2s' }}
      />
      <div className="absolute inset-0 bg-ink/40" />
    </div>
  )
}
