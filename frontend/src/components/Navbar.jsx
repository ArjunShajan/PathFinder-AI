import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Menu, X, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/quiz', label: 'Discovery Quiz' },
  { to: '/careers', label: 'Careers' },
  { to: '/skills', label: 'Skill Gap' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/mentor', label: 'AI Mentor' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'border-ink-line bg-ink/90 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.6)]' : 'border-ink-line/40 bg-ink/60'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="group flex items-center gap-2 font-display text-lg font-semibold text-paper">
          <Compass className="h-5 w-5 text-gold transition-transform duration-500 group-hover:rotate-180" />
          PathFinder <span className="text-gradient">AI</span>
        </Link>

        {user && (
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `group relative py-1 font-body text-sm transition-colors ${
                    isActive ? 'text-gold' : 'text-paper/70 hover:text-paper'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-gradient-to-r from-gold to-sprout transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full border border-ink-line px-4 py-2 text-sm text-paper/80 transition-colors hover:border-gold hover:text-gold"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm text-paper/80 hover:text-paper">
                Log in
              </Link>
              <button onClick={() => navigate('/signup')} className="btn-primary !px-5 !py-2 text-sm">
                <Sparkles className="h-4 w-4" /> Get started
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink-line/70 md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {user &&
                links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-paper/80 hover:bg-ink-card hover:text-gold"
                  >
                    {l.label}
                  </NavLink>
                ))}
              {user ? (
                <button
                  onClick={logout}
                  className="mt-2 rounded-lg px-3 py-2 text-left text-paper/80 hover:bg-ink-card hover:text-gold"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-paper/80 hover:bg-ink-card hover:text-gold"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-gold"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
