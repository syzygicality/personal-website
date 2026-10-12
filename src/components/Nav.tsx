'use client'

import { useView } from './ViewContext'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Projects' },
]

export default function Nav({ fullName }: { fullName: string }) {
  const { view, goToSection } = useView()

  // In the graph view the sections aren't mounted, so switch back first.
  const onNav = (id: string) => (e: React.MouseEvent) => {
    if (view !== 'graph') return
    e.preventDefault()
    goToSection(id)
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-ink/12 bg-bg/78 backdrop-blur-[10px]">
      <div className="wrap flex items-center justify-between py-3">
        <a href="#top" onClick={onNav('top')} className="flex items-center gap-3">
          <span className="inline-block size-[26px] rounded-full bg-linear-[120deg] from-acc2 to-acc" />
          <span className="text-sm font-bold tracking-[-.01em]">{fullName}</span>
        </a>
        <div className="flex items-center gap-4 font-mono text-xs tracking-[.06em] md:gap-7">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={onNav(id)}
              className="opacity-70 transition-all duration-250 ease-out-soft hover:-translate-y-0.5 hover:text-acc hover:opacity-100"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
