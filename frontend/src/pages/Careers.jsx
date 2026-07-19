import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Cpu, Stethoscope, Palette, Scale, Building2, Leaf, Rocket, BookOpen, Wrench, Megaphone, ArrowRight } from 'lucide-react'
import client from '../api/client'
import Loader from '../components/Loader'

const ICONS = {
  cpu: Cpu,
  stethoscope: Stethoscope,
  palette: Palette,
  scale: Scale,
  building: Building2,
  leaf: Leaf,
  rocket: Rocket,
  book: BookOpen,
  wrench: Wrench,
  megaphone: Megaphone,
}

export default function Careers() {
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    client.get('/careers').then(({ data }) => setCareers(data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading careers…" />

  const categories = ['All', ...new Set(careers.map((c) => c.category))]
  const visible = filter === 'All' ? careers : careers.filter((c) => c.category === filter)

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow mb-2">Career Explorer</p>
      <h1 className="text-3xl font-medium">Find a path worth exploring</h1>
      <p className="mt-2 text-paper/60">Ten real career paths — pick one to see required skills, salary range, and a simulated day in the life.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              filter === cat ? 'border-gold bg-gold/10 text-gold' : 'border-ink-line text-paper/70 hover:border-paper/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((c, i) => {
          const Icon = ICONS[c.icon] || Rocket
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link to={`/careers/${c.id}`} className="card group flex h-full flex-col p-6 transition-colors hover:border-gold/50">
                <div className="flex items-start justify-between">
                  <Icon className="h-7 w-7 text-sprout" />
                  <span className="rounded-full bg-ink-line px-2 py-0.5 text-xs text-paper/60">{c.future_demand} demand</span>
                </div>
                <h3 className="mt-4 text-lg font-medium">{c.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-paper/40">{c.category}</p>
                <p className="mt-3 flex-1 text-sm text-paper/65">{c.blurb}</p>
                <p className="mt-4 text-sm font-medium text-gold">{c.salary_range}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-paper/50 group-hover:text-gold">
                  View details <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
