// Large, breathing "eclipse ring" backdrop for the hero — a soft-focus halo
// behind a brighter ring that slowly drifts through the brand palette
// (gold → nebula → sprout). Pure CSS/SVG motion, no sound, no interaction
// required. Sits behind all hero content (pointer-events disabled).
export default function EclipseGlow({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <div className="eclipse-wrap">
        <div className="eclipse-halo" />
        <div className="eclipse-ring" />
      </div>
    </div>
  )
}
