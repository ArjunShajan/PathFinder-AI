import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, X, Plus } from 'lucide-react'
import client from '../api/client'

export default function Skills() {
  const [targetCareer, setTargetCareer] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [skills, setSkills] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addSkill(e) {
    e.preventDefault()
    const s = skillInput.trim()
    if (s && !skills.includes(s)) setSkills([...skills, s])
    setSkillInput('')
  }

  function removeSkill(s) {
    setSkills(skills.filter((k) => k !== s))
  }

  async function analyze() {
    if (!targetCareer.trim()) {
      setError('Enter a target career first.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await client.post('/skills/gap-analysis', {
        current_skills: skills,
        target_career: targetCareer,
      })
      setResult(data.result)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not run the analysis.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="eyebrow mb-2">Skill Gap Analysis</p>
      <h1 className="text-3xl font-medium">See what stands between you and your goal</h1>

      <div className="card mt-8 p-6">
        <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-paper/60">Target career</label>
        <input
          className="input-field"
          placeholder="e.g. Data Scientist, UX Designer, Civil Engineer"
          value={targetCareer}
          onChange={(e) => setTargetCareer(e.target.value)}
        />

        <label className="mb-1 mt-5 block text-xs font-mono uppercase tracking-wide text-paper/60">Your current skills</label>
        <form onSubmit={addSkill} className="flex gap-2">
          <input
            className="input-field"
            placeholder="Type a skill and press Add"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
          />
          <button type="submit" className="btn-ghost !px-4 !py-2 shrink-0 text-sm">
            <Plus className="h-4 w-4" /> Add
          </button>
        </form>

        {skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="flex items-center gap-1 rounded-full border border-ink-line bg-ink-soft px-3 py-1 text-xs text-paper/80">
                {s}
                <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                  <X className="h-3 w-3 text-paper/50 hover:text-red-300" />
                </button>
              </span>
            ))}
          </div>
        )}

        {error && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

        <button onClick={analyze} disabled={loading} className="btn-primary mt-6 w-full">
          <Sparkles className="h-4 w-4" /> {loading ? 'Analyzing…' : 'Analyze my gap'}
        </button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-5">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Readiness for {result.target_career}</p>
              <span className="text-2xl font-medium text-gold">{result.readiness_percent}%</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-line">
              <motion.div
                className="h-full bg-gradient-to-r from-sprout to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${result.readiness_percent}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="mt-4 text-sm text-sprout-soft">{result.encouragement}</p>
          </div>

          {result.matched_skills?.length > 0 && (
            <div className="card p-6">
              <p className="eyebrow mb-3">Skills you already have that count</p>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.map((s) => (
                  <span key={s} className="rounded-full border border-sprout/40 bg-sprout/10 px-3 py-1 text-xs text-sprout-soft">{s}</span>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <p className="eyebrow mb-4">Skill gaps to close</p>
            <div className="space-y-3">
              {result.skill_gaps?.map((g, i) => (
                <div key={i} className="rounded-xl border border-ink-line bg-ink-soft p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{g.skill}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        g.priority === 'High' ? 'bg-red-500/15 text-red-300' : g.priority === 'Medium' ? 'bg-gold/15 text-gold' : 'bg-ink-line text-paper/60'
                      }`}
                    >
                      {g.priority} priority
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-paper/65">{g.why_it_matters}</p>
                  <p className="mt-2 text-sm text-nebula-soft">→ {g.how_to_learn}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <p className="eyebrow mb-3">Recommended next steps</p>
            <ol className="space-y-2">
              {result.recommended_next_steps?.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm text-paper/80">
                  <span className="font-mono text-gold">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      )}
    </div>
  )
}
