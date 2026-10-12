import Image from 'next/image'
import type { Experience as ExperienceItem, Site } from '@/lib/site'
import SectionHeading from './SectionHeading'
import SkillsDialog from './SkillsDialog'

function ExperienceCard({ exp }: { exp: ExperienceItem }) {
  return (
    <div className="flex flex-col gap-4 border border-ink/14 bg-card p-[22px] text-ink">
      <div className="flex items-start gap-3.5">
        <div
          className="relative size-11 flex-none overflow-hidden"
          style={{ backgroundColor: exp.logoBackground, borderRadius: exp.logoRadius }}
        >
          {exp.logo && (
            <Image src={exp.logo} alt={exp.company} fill sizes="44px" style={{ objectFit: exp.logoFit }} />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
          <div className="text-[21px]/[1.1] font-bold tracking-[-.02em] text-balance">{exp.role}</div>
          <div className="font-mono text-[13px] tracking-[.04em]">{exp.company}</div>
          <div className="font-mono text-xs tracking-[.06em] text-ink2">
            {exp.start} – {exp.current ? <span className="font-bold text-acc">Present</span> : exp.end}
          </div>
        </div>
      </div>
      <p className="m-0 text-[15px]/[1.5] text-pretty">{exp.blurb}</p>
    </div>
  )
}

export default function Experience({ site }: { site: Site }) {
  return (
    <section id="experience" className="relative z-2 py-12">
      <div className="wrap">
        <SectionHeading title="Experience" className="mb-7">
          <SkillsDialog groups={site.skillGroups} />
        </SectionHeading>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[18px]">
          {site.experience.map((exp) => <ExperienceCard key={`${exp.company}-${exp.role}`} exp={exp} />)}
        </div>
      </div>
    </section>
  )
}
