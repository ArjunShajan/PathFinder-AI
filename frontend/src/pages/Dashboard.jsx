import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Map, TrendingUp, MessagesSquare, ArrowRight, Users } from 'lucide-react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import AptitudeRadar from '../components/AptitudeRadar'
import Loader from '../components/Loader'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const endpoint = { student: '/dashboard/student', parent: '/dashboard/parent', teacher: '/dashboard/teacher' }[user.role]
    client
      .get(endpoint)
      .then(({ data }) => setData(data))
      .catch((err) => setError(err?.response?.data?.detail || 'Could not load your dashboard.'))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <Loader label="Loading your dashboard…" />

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-medium">
        Hi, {user?.name?.split(' ')[0]}.
      </motion.h1>
      <p className="mt-1 text-paper/60">
        {user.role === 'student' && 'Here is where your path stands today.'}
        {user.role === 'parent' && "Here's an overview of your student's progress."}
        {user.role === 'teacher' && 'Here is your class roster and their profiles.'}
      </p>

      {error && <p className="mt-6 rounded-lg bg-red-500/10 px-4 py-3 text-red-300">{error}</p>}

      {user.role === 'teacher' && data && <TeacherView data={data} />}
      {(user.role === 'student' || user.role === 'parent') && data && <StudentOverview data={data} isParent={user.role === 'parent'} />}
    </div>
  )
}

function StudentOverview({ data, isParent }) {
  const { profile, latest_quiz_analysis, has_roadmap, roadmap_preview } = data

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-3">
      <div className="card p-6 lg:col-span-2">
        <p className="eyebrow mb-2">{isParent ? "Student summary" : "Your summary"}</p>
        <p className="text-paper/80">
          {profile?.summary || 'No summary yet — take the Discovery Quiz to build a profile.'}
        </p>
        {profile?.interests?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.interests.map((tag) => (
              <span key={tag} className="rounded-full border border-sprout/40 bg-sprout/10 px-3 py-1 text-xs text-sprout-soft">
                {tag}
              </span>
            ))}
          </div>
        )}
        {!isParent && (
          <Link to="/quiz" className="mt-5 inline-flex items-center gap-2 text-sm text-gold hover:underline">
            {profile?.summary ? 'Retake the quiz' : 'Take the Discovery Quiz'} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="card p-6">
        <p className="eyebrow mb-2">Aptitude map</p>
        <AptitudeRadar aptitude={profile?.aptitude} />
      </div>

      {latest_quiz_analysis?.career_matches?.length > 0 && (
        <div className="card p-6 lg:col-span-2">
          <p className="eyebrow mb-3">Top career matches</p>
          <div className="space-y-3">
            {latest_quiz_analysis.career_matches.slice(0, 4).map((c) => (
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
      )}

      <div className="card flex flex-col justify-between p-6">
        <div>
          <p className="eyebrow mb-2 flex items-center gap-2">
            <Map className="h-4 w-4" /> Roadmap
          </p>
          {has_roadmap ? (
            <ul className="space-y-2 text-sm text-paper/70">
              {roadmap_preview.map((m, i) => (
                <li key={i}>
                  <span className="font-medium text-paper">{m.stage}:</span> {m.focus}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-paper/60">No roadmap generated yet.</p>
          )}
        </div>
        {!isParent && (
          <Link to="/roadmap" className="mt-4 inline-flex items-center gap-2 text-sm text-gold hover:underline">
            {has_roadmap ? 'View full roadmap' : 'Generate a roadmap'} <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {!isParent && (
        <>
          <QuickLink to="/skills" icon={TrendingUp} title="Skill gap analysis" desc="Compare your skills against a target career." />
          <QuickLink to="/mentor" icon={MessagesSquare} title="Talk to your AI mentor" desc="Ask about subjects, exams, or next steps." />
          <QuickLink to="/careers" icon={Sparkles} title="Explore careers" desc="Simulate a day in the life of 10+ careers." />
        </>
      )}
    </div>
  )
}

function QuickLink({ to, icon: Icon, title, desc }) {
  return (
    <Link to={to} className="card group flex flex-col justify-between p-6 transition-colors hover:border-gold/50">
      <div>
        <Icon className="h-6 w-6 text-nebula" />
        <p className="mt-3 font-medium">{title}</p>
        <p className="mt-1 text-sm text-paper/60">{desc}</p>
      </div>
      <ArrowRight className="mt-4 h-4 w-4 text-paper/40 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
    </Link>
  )
}

function TeacherView({ data }) {
  return (
    <div className="mt-8 card p-6">
      <p className="eyebrow mb-4 flex items-center gap-2">
        <Users className="h-4 w-4" /> Class roster ({data.roster.length})
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-line text-paper/50">
              <th className="pb-2 pr-4">Name</th>
              <th className="pb-2 pr-4">Level</th>
              <th className="pb-2 pr-4">Interests</th>
              <th className="pb-2 pr-4">Top aptitude</th>
              <th className="pb-2">Quiz taken</th>
            </tr>
          </thead>
          <tbody>
            {data.roster.map((s) => (
              <tr key={s.id} className="border-b border-ink-line/50 last:border-0">
                <td className="py-3 pr-4 font-medium">{s.name}</td>
                <td className="py-3 pr-4 text-paper/70">{s.class_level || '—'}</td>
                <td className="py-3 pr-4 text-paper/70">{s.interests?.join(', ') || '—'}</td>
                <td className="py-3 pr-4 text-paper/70">{s.top_aptitude || '—'}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${s.has_taken_quiz ? 'bg-sprout/15 text-sprout-soft' : 'bg-ink-line text-paper/50'}`}>
                    {s.has_taken_quiz ? 'Yes' : 'Not yet'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
