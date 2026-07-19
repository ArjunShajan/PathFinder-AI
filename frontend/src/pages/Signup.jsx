import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ConstellationField from '../components/ConstellationField'

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'parent', label: 'Parent' },
  { value: 'teacher', label: 'Teacher' },
]

const classLevels = [
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
  'College - Year 1', 'College - Year 2', 'College - Year 3', 'College - Year 4',
]

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', class_level: '', linked_student_email: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role: form.role }
      if (form.role === 'student') payload.class_level = form.class_level
      if (form.role === 'parent') payload.linked_student_email = form.linked_student_email
      await signup(payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not create your account. Try a different email.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-16">
      <ConstellationField density={30} className="opacity-40" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative w-full max-w-md p-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <Compass className="h-6 w-6 text-gold" />
          <h1 className="text-2xl font-medium">Create your account</h1>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {roles.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setForm({ ...form, role: r.value })}
              className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
                form.role === r.value
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-ink-line text-paper/70 hover:border-paper/30'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-paper/60">Full name</label>
            <input
              required
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-paper/60">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-paper/60">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </div>

          {form.role === 'student' && (
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-paper/60">Class / level</label>
              <select
                className="input-field"
                value={form.class_level}
                onChange={(e) => setForm({ ...form, class_level: e.target.value })}
              >
                <option value="">Select…</option>
                {classLevels.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {form.role === 'parent' && (
            <div>
              <label className="mb-1 block text-xs font-mono uppercase tracking-wide text-paper/60">
                Your student&rsquo;s email
              </label>
              <input
                type="email"
                className="input-field"
                value={form.linked_student_email}
                onChange={(e) => setForm({ ...form, linked_student_email: e.target.value })}
                placeholder="student@example.com"
              />
            </div>
          )}

          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            <UserPlus className="h-4 w-4" /> {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-paper/60">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
