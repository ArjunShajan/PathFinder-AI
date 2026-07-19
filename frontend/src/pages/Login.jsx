import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ConstellationField from '../components/ConstellationField'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Could not log in. Check your email and password.')
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
          <h1 className="text-2xl font-medium">Welcome back</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
          <button type="submit" disabled={busy} className="btn-primary w-full">
            <LogIn className="h-4 w-4" /> {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-paper/60">
          New here?{' '}
          <Link to="/signup" className="text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
