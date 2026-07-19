import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'
import client from '../api/client'
import Loader from '../components/Loader'
import AptitudeRadar from '../components/AptitudeRadar'

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    client
      .get('/quiz/questions')
      .then(({ data }) => setQuestions(data))
      .finally(() => setLoading(false))
  }, [])

  function choose(option) {
    setAnswers({ ...answers, [questions[index].id]: option })
    if (index < questions.length - 1) {
      setTimeout(() => setIndex(index + 1), 200)
    }
  }

  async function submit() {
    setSubmitting(true)
    setError('')
    const payload = {
      answers: questions.map((q) => ({
        question: q.question,
        category: q.category,
        answer: answers[q.id],
      })),
    }
    try {
      const { data } = await client.post('/quiz/submit', payload)
      setResult(data.analysis)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not analyze your answers. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader label="Preparing your quiz…" />

  if (result) return <ResultView result={result} />

  const q = questions[index]
  const progress = ((index + (answers[q?.id] ? 1 : 0)) / questions.length) * 100
  const allAnswered = questions.length > 0 && questions.every((qq) => answers[qq.id])

  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="eyebrow mb-2">Career Discovery Quiz</p>
      <h1 className="text-2xl font-medium">Question {index + 1} of {questions.length}</h1>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-line">
        <motion.div
          className="h-full bg-gold"
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q?.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="card mt-8 p-7"
        >
          <p className="eyebrow mb-3">{q?.category}</p>
          <h2 className="text-xl font-medium">{q?.question}</h2>
          <div className="mt-6 space-y-3">
            {q?.options.map((opt) => {
              const selected = answers[q.id] === opt
              return (
                <button
                  key={opt}
                  onClick={() => choose(opt)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                    selected
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-ink-line text-paper/80 hover:border-paper/30'
                  }`}
                >
                  <span>{opt}</span>
                  {selected && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {index < questions.length - 1 ? (
          <button
            onClick={() => setIndex(Math.min(questions.length - 1, index + 1))}
            disabled={!answers[q?.id]}
            className="btn-ghost !px-4 !py-2 text-sm disabled:opacity-30"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={!allAnswered || submitting} className="btn-primary text-sm">
            <Sparkles className="h-4 w-4" /> {submitting ? 'Analyzing…' : 'Get my results'}
          </button>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-red-300">{error}</p>}
    </div>
  )
}

function ResultView({ result }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl px-5 py-14">
      <p className="eyebrow mb-2">Your profile</p>
      <h1 className="text-3xl font-medium">Here&rsquo;s what we found</h1>
      <p className="mt-4 text-paper/75">{result.summary}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow mb-3">Aptitude map</p>
          <AptitudeRadar aptitude={result.aptitude} />
        </div>
        <div className="card p-6">
          <p className="eyebrow mb-3">Personality</p>
          <div className="flex flex-wrap gap-2">
            {result.personality?.traits?.map((t) => (
              <span key={t} className="rounded-full border border-nebula/40 bg-nebula/10 px-3 py-1 text-xs text-nebula-soft">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-paper/70">{result.personality?.work_style}</p>
        </div>
      </div>

      <div className="card mt-6 p-6">
        <p className="eyebrow mb-4">Top career matches</p>
        <div className="space-y-3">
          {result.career_matches?.map((c) => (
            <div key={c.title} className="flex items-center justify-between gap-4 border-b border-ink-line/60 pb-3 last:border-0">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-paper/60">{c.why}</p>
              </div>
              <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold">
                {c.match_percent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link to="/roadmap" className="btn-primary">Build my roadmap <ArrowRight className="h-4 w-4" /></Link>
        <Link to="/careers" className="btn-ghost">Explore these careers</Link>
      </div>
    </motion.div>
  )
}
