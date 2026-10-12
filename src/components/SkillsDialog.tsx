'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Site } from '@/lib/site'
import { pillButtonClass } from './PillButton'

const ease = 'ease-out-soft'

export default function SkillsDialog({ groups }: { groups: Site['skillGroups'] }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Portalled to <body> so the overlay escapes the section's stacking context and covers the nav.
  const overlay = (
    <div
      onClick={() => setOpen(false)}
      className={`fixed inset-0 z-100 flex items-center justify-center p-6 transition-all duration-[350ms] ${ease} ${open ? 'pointer-events-auto bg-ink/60 opacity-100 backdrop-blur-[2px]' : 'pointer-events-none bg-ink/0 opacity-0 backdrop-blur-none'}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Skills"
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[82vh] w-full max-w-[720px] overflow-auto border border-ink/20 bg-bg p-6 transition-all duration-[380ms] md:p-9 ${ease} ${open ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3.5 scale-[.94] opacity-0'}`}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-5 right-5 flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink/30 bg-transparent text-ink transition-all duration-250 hover:-translate-y-[3px] hover:border-acc hover:text-acc"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <h2 className="mt-0 mb-6 text-[clamp(28px,4vw,44px)]/none font-bold tracking-[-.03em]">Skills</h2>
        <div className="flex flex-col border-b border-ink/14">
          {groups.map((grp) => (
            <div key={grp.name} className="grid items-baseline gap-4 border-t border-ink/14 py-3.5 sm:grid-cols-[150px_1fr]">
              <div className="font-mono text-xs font-bold tracking-[.1em] text-acc">{grp.name}</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink2">
                {grp.items.map((sk) => (
                  <span key={sk} className="transition-all hover:translate-x-1 hover:text-acc2">{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button onClick={() => setOpen(true)} className={`ml-auto self-center ${pillButtonClass}`}>
        View skills
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
      </button>
      {mounted && createPortal(overlay, document.body)}
    </>
  )
}
