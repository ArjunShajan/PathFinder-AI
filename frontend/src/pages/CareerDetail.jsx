import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, Clock } from 'lucide-react'
import client from '../api/client'
import Loader from '../components/Loader'

export default function CareerDetail() {
  const { careerId } = useParams()
  const [career, setCareer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simulation, setSimulation] = useState(null)
  const [simLoading, setSimLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    client.get(`/careers/${careerId}`).then(({ data }) => setCareer(data)).finally(() => setLoading(false))
  }, [careerId])

  async function runSimulation() {
    setSimLoading(true)
    setError('')
    try {
      const { data } = await client.post(`/careers/${careerId}/simulate`)
      setSimulation(data.simulation)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not generate the simulation.')
    } finally {
      setSimLoading(false)
    }
  }

  if (loading) return <Loader label="Loading career details…" />
  if (!career) return null

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Link to="/careers" className="inline-flex items-center gap-1 text-sm text-paper/60 hover:text-paper">
        <ArrowLeft className="h-4 w-4" /> Back to careers
      </Link>

      <p className="eyebrow mt-6 mb-2">{career.category}</p>
      <h1 className="text-3xl font-medium">{career.title}</h1>
      <p className="mt-3 text-paper/70">{career.nature_of_work}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow mb-3">Required skills</p>
          <div className="flex flex-wrap gap-2">
            {career.required_skills.map((s) => (
              <span key={s} className="rounded-full border border-sprout/40 bg-sprout/10 px-3 py-1 text-xs text-sprout-soft">{s}</span>
            ))}
          </div>
        </div>
        <div className="card p-6">
          <p className="eyebrow mb-3">Salary range</p>
          <p className="text-xl font-medium text-gold">{career.salary_range}</p>
          <p className="mt-2 text-sm text-paper/50">Future demand: {career.future_demand}</p>
        </div>
        <div className="card p-6 md:col-span-2">
          <p className="eyebrow mb-3">Educational pathway</p>
          <ol className="space-y-2">
            {career.educational_pathways.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-paper/75">
                <span className="font-mono text-gold">{String(i + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-1">Simulate a day</p>
            <p className="text-sm text-paper/60">{career.typical_day}</p>
          </div>
          {!simulation && (
            <button onClick={runSimulation} disabled={simLoading} className="btn-primary shrink-0 !px-5 !py-2.5 text-sm">
              <Sparkles className="h-4 w-4" /> {simLoading ? 'Simulating…' : 'Run simulation'}
            </button>
          )}
        </div>

        {error && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

        <AnimatePresence>
          {simulation && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 overflow-hidden">
              <p className="italic text-paper/70">{simulation.intro}</p>
              <div className="mt-5 space-y-4">
                {simulation.scenes?.map((scene, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-ink-line bg-ink-soft p-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wide text-gold">
                      <Clock className="h-3.5 w-3.5" /> {scene.time}
                    </div>
                    <p className="mt-2 text-sm text-paper/85">{scene.situation}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {scene.choices?.map((c, ci) => (
                        <span key={ci} className="rounded-full border border-ink-line px-3 py-1 text-xs text-paper/60">{c}</span>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-sprout-soft">{scene.best_choice_insight}</p>
                  </motion.div>
                ))}
              </div>
              <p className="mt-5 text-sm italic text-paper/60">{simulation.closing_reflection}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
