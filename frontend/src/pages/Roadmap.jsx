import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Map, CheckCircle2 } from 'lucide-react'
import client from '../api/client'
import Loader from '../components/Loader'

export default function Roadmap() {
  const [targetCareer, setTargetCareer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    client
      .get('/roadmap/latest')
      .then(({ data }) => {
        if (data) setResult(data.result)
      })
      .finally(() => setLoading(false))
  }, [])

  async function generate() {
    setGenerating(true)
    setError('')
    try {
      const { data } = await client.post('/roadmap/generate', { target_career: targetCareer || undefined })
      setResult(data.result)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not generate a roadmap.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <Loader label="Loading your roadmap…" />

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow mb-2 flex items-center gap-2">
        <Map className="h-4 w-4" /> Learning Roadmap
      </p>
      <h1 className="text-3xl font-medium">Your path from here to graduation</h1>

      <div className="card mt-8 p-6">
        <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-paper/60">
          Target career <span className="text-paper/40">(optional — we can infer one from your profile)</span>
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input-field"
            placeholder="e.g. Software Engineer"
            value={targetCareer}
            onChange={(e) => setTargetCareer(e.target.value)}
          />
          <button onClick={generate} disabled={generating} className="btn-primary shrink-0 text-sm">
            <Sparkles className="h-4 w-4" /> {generating ? 'Generating…' : result ? 'Regenerate' : 'Generate roadmap'}
          </button>
        </div>
        {error && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          <p className="text-sm text-paper/60">
            Target: <span className="text-gold">{result.target_career}</span>
          </p>

          <div className="relative mt-8 space-y-8 border-l border-ink-line pl-8">
            {result.milestones?.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-[38px] top-1 h-4 w-4 rounded-full border-2 border-gold bg-ink" />
                <p className="font-mono text-xs uppercase tracking-wide text-gold">{m.stage}</p>
                <h3 className="mt-1 text-lg font-medium">{m.focus}</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1.5 text-xs uppercase tracking-wide text-paper/40">Skills to build</p>
                    <div className="flex flex-wrap gap-1.5">
                      {m.skills_to_build?.map((s) => (
                        <span key={s} className="rounded-full border border-sprout/40 bg-sprout/10 px-2.5 py-0.5 text-xs text-sprout-soft">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1.5 text-xs uppercase tracking-wide text-paper/40">Activities</p>
                    <ul className="space-y-1 text-sm text-paper/70">
                      {m.activities?.map((a, ai) => (
                        <li key={ai}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {result.checkpoints?.length > 0 && (
            <div className="card mt-8 p-6">
              <p className="eyebrow mb-3">Checkpoints to look forward to</p>
              <ul className="space-y-2">
                {result.checkpoints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-paper/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sprout" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
