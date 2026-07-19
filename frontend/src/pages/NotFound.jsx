import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <Compass className="mb-4 h-10 w-10 text-gold" />
      <h1 className="text-3xl font-medium">Lost your way?</h1>
      <p className="mt-2 text-paper/60">This page isn&rsquo;t on your roadmap.</p>
      <Link to="/" className="btn-primary mt-6">Back to safety</Link>
    </div>
  )
}
