import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Brain,
  Compass,
  MessagesSquare,
  TrendingUp,
  Map,
  ArrowRight,
  Sparkles,
  Target,
} from 'lucide-react'
import ConstellationField from '../components/ConstellationField'
import EclipseGlow from '../components/EclipseGlow'
import TiltCard from '../components/TiltCard'
import { useAuth } from '../context/AuthContext'

const stages = ['Class 6', 'Class 9', 'Class 11-12', 'College', 'Career']

const features = [
  {
    icon: Brain,
    title: 'Discovery Quiz',
    desc: 'A short quiz reads your interests, aptitude, and personality — no guesswork, no labels that box you in.',
    iconColor: 'text-gold',
    orbClass: 'bg-gradient-to-br from-gold/30 to-transparent',
  },
  {
    icon: Compass,
    title: 'Career Explorer',
    desc: 'Browse real career paths with salary ranges, required skills, and a simulated "day in the life."',
    iconColor: 'text-sprout',
    orbClass: 'bg-gradient-to-br from-sprout/30 to-transparent',
  },
  {
    icon: TrendingUp,
    title: 'Skill Gap Analysis',
    desc: 'See exactly what stands between where you are and the career you want — and what to do about it.',
    iconColor: 'text-nebula',
    orbClass: 'bg-gradient-to-br from-nebula/30 to-transparent',
  },
  {
    icon: Map,
    title: 'Learning Roadmap',
    desc: 'A year-by-year plan from where you stand now through graduation, built around your own goals.',
    iconColor: 'text-gold',
    orbClass: 'bg-gradient-to-br from-gold/30 to-transparent',
  },
  {
    icon: MessagesSquare,
    title: 'AI Mentor',
    desc: 'Ask anything about subjects, exams, or next steps. Your mentor remembers your profile and history.',
    iconColor: 'text-sprout',
    orbClass: 'bg-gradient-to-br from-sprout/30 to-transparent',
  },
]

const floatingBadges = [
  {
    icon: Compass,
    label: '5 stages, one path',
    className: 'left-[2%] top-[12%]',
    anim: 'animate-bob',
    delay: '0s',
    color: 'text-gold',
  },
  {
    icon: Sparkles,
    label: 'AI-personalised quiz',
    className: 'right-[3%] top-[20%]',
    anim: 'animate-bobFast',
    delay: '0.6s',
    color: 'text-nebula',
  },
  {
    icon: Target,
    label: 'Skill gaps, mapped',
    className: 'left-[6%] bottom-[8%]',
    anim: 'animate-bob',
    delay: '1.2s',
    color: 'text-sprout',
  },
]

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-24 pt-20 md:pt-28">
        <EclipseGlow className="-z-10 opacity-80" />
        <ConstellationField density={55} className="opacity-70" />

        {/* Floating stat badges — living, breathing accents around the hero */}
        {floatingBadges.map((b) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={`glass-panel absolute z-10 hidden items-center gap-2 px-4 py-2.5 shadow-card lg:flex ${b.className} ${b.anim}`}
            style={{ animationDelay: b.delay }}
          >
            <b.icon className={`h-4 w-4 ${b.color}`} />
            <span className="whitespace-nowrap font-mono text-xs text-paper/80">{b.label}</span>
          </motion.div>
        ))}

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow mb-5"
          >
            Class 6 → Career
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-medium leading-tight md:text-6xl"
          >
            Discover your potential.
            <br />
            <span className="text-gradient">Build your future</span>, one milestone at a time.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-base text-paper/70 md:text-lg"
          >
            PathFinder AI is a career-discovery mentor for students — from Class 6 through
            graduation — that turns quiz answers into a real, personalized path forward.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 animate-ringPulse rounded-full bg-gold/40 blur-xl"
              />
              <Link to={user ? '/dashboard' : '/signup'} className="btn-primary">
                {user ? 'Go to dashboard' : 'Start your journey'} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Link to={user ? '/quiz' : '/login'} className="btn-ghost">
              {user ? 'Take the quiz' : 'I already have an account'}
            </Link>
          </motion.div>
        </div>

        {/* Pathway timeline signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative mx-auto mt-20 hidden max-w-4xl md:block"
        >
          <svg viewBox="0 0 800 80" className="w-full">
            <motion.path
              d="M 20 40 Q 200 -10 400 40 T 780 40"
              fill="none"
              stroke="#37B58A"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            {stages.map((s, i) => {
              const x = 20 + i * (760 / (stages.length - 1))
              const y = 40 + Math.sin((i / (stages.length - 1)) * Math.PI) * -20
              return (
                <g key={s}>
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#F0A93C"
                    animate={{ scale: [1, 1.35, 1] }}
                    transition={{
                      duration: 2.4,
                      delay: i * 0.25,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  />
                </g>
              )
            })}
          </svg>
          <div className="mt-2 flex justify-between px-1 font-mono text-xs uppercase tracking-wide text-paper/60">
            {stages.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative px-5 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="text-3xl font-medium md:text-4xl">Five tools, one connected path</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.05 }}
              >
                <TiltCard>
                  <div className="card p-6">
                    <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 animate-orbGlow rounded-2xl ${f.orbClass}`}
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                      <f.icon className={`relative h-6 w-6 ${f.iconColor}`} />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-paper/65">{f.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.3 }}
            >
              <TiltCard>
                <div className="card flex h-full flex-col justify-center bg-gradient-to-br from-gold/15 to-transparent p-6">
                  <p className="text-sm text-paper/70">Ready when you are.</p>
                  <Link
                    to={user ? '/dashboard' : '/signup'}
                    className="mt-3 inline-flex items-center gap-2 font-medium text-gold hover:underline"
                  >
                    {user ? 'Continue your path' : 'Create a free account'}{' '}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-line/70 px-5 py-8 text-center text-xs text-paper/40">
        Built for students, parents, and teachers navigating what comes next.
      </footer>
    </div>
  )
}
