'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { Project } from '@/lib/site'
import { pillButtonClass } from './PillButton'
import SectionHeading from './SectionHeading'

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)

function ProjectCard({ project: p }: { project: Project }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener"
      className="flex h-full w-full flex-col overflow-hidden border border-ink/18 bg-card transition-[transform,box-shadow,border-color] duration-[450ms] ease-out-soft hover:-translate-y-2 hover:border-acc hover:shadow-[inset_0_4px_0_var(--acc),0_20px_44px_-20px_color-mix(in_srgb,var(--ink)_50%,transparent)]"
    >
      <div
        className="relative aspect-[16/10] overflow-hidden border-b border-ink/10 bg-card2"
        style={p.imageBackground ? { background: p.imageBackground } : undefined}
      >
        {p.image && (
          <div className={`absolute transition-transform duration-[600ms] ease-out-soft hover:scale-[1.08] ${p.imageFit === 'contain' ? 'inset-y-0 inset-x-[18px]' : 'inset-0'}`}>
            <Image
              src={p.image}
              alt={p.alt}
              fill
              sizes="(min-width: 768px) 300px, 100vw"
              style={{ objectFit: p.imageFit, objectPosition: p.imagePosition }}
            />
          </div>
        )}
      </div>
      <div className="px-4 pt-4 pb-[18px]">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[clamp(19px,2vw,25px)]/none font-bold tracking-[-.02em]">{p.name}</div>
          <div className="flex items-center opacity-55">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
          </div>
        </div>
        <p className="mt-[9px] mb-0 text-sm/[1.45] text-ink2">{p.description}</p>
        <div className="mt-3 flex flex-wrap gap-[5px]">
          {p.tags.map((t) => (
            <span key={t} className="rounded-[20px] border border-ink/25 px-[9px] py-1 font-mono text-[11px]">{t}</span>
          ))}
        </div>
      </div>
    </a>
  )
}

export default function Projects({ projects, perRow }: { projects: Project[]; perRow: number }) {
  const [rows, setRows] = useState(1)

  // The grid has lcm(1..perRow) columns so a short last row can be spread evenly across the full width.
  let cols = 1
  for (let i = 1; i <= perRow; i++) cols = (cols * i) / gcd(cols, i)
  const shown = projects.slice(0, rows * perRow)

  return (
    <section id="work" className="relative z-2 pt-12 pb-16">
      <div className="wrap">
        <SectionHeading title="Projects" className="mb-1" />
      </div>
      <div className="wrap mt-6">
        <div
          className="grid grid-cols-1 gap-[18px] md:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
          style={{ '--cols': cols } as React.CSSProperties}
        >
          {shown.map((p, i) => {
            const rowStart = Math.floor(i / perRow) * perRow
            const inRow = Math.min(perRow, projects.length - rowStart)
            return (
              <div
                key={p.name}
                className={`flex min-w-0 md:col-span-(--span) ${i >= perRow ? 'animate-proj-in' : ''}`}
                style={{ '--span': cols / inRow, animationDelay: i >= perRow ? `${(i % perRow) * 60}ms` : undefined } as React.CSSProperties}
              >
                <ProjectCard project={p} />
              </div>
            )
          })}
        </div>
        {shown.length < projects.length && (
          <div className="mt-7 flex justify-center">
            <button type="button" onClick={() => setRows((r) => r + 1)} className={pillButtonClass}>
              See more
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
