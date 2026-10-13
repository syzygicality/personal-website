'use client'

import { useView, type View } from './ViewContext'

const OPTIONS: { view: View; label: string; aria: string }[] = [
  { view: 'normal', label: 'Site', aria: 'Page view' },
  { view: 'graph', label: 'Graph', aria: 'Graph view' },
]

export default function ViewToggle() {
  const { view, setView } = useView()

  return (
    <div className="fixed top-1/2 right-4.5 z-60 flex -translate-y-1/2 flex-col gap-0.5 rounded-full border border-ink/18 bg-bg/90 p-1 backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 top-1 z-0 h-16 rounded-full bg-ink transition-transform duration-380 ease-[cubic-bezier(.65,0,.25,1)]"
        style={{ transform: view === 'graph' ? 'translateY(66px)' : 'none' }}
      />
      {OPTIONS.map((o) => (
        <button
          key={o.view}
          onClick={() => setView(o.view)}
          aria-label={o.aria}
          className={`relative z-1 flex h-16 rotate-180 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-[0_14px] font-mono text-[10px] font-bold tracking-[.06em] transition-colors duration-300 [writing-mode:vertical-rl] ${view === o.view ? 'text-bg' : 'text-ink'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
