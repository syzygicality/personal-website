import type { Site } from '@/lib/site'

const iconClass = 'flex size-9 items-center justify-center rounded-full border border-ink/30 text-ink transition-all duration-250 hover:-translate-y-[3px] hover:border-acc hover:text-acc'

const outline = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

// A link is hidden when its value is missing from site.yaml.
export default function SocialLinks({ site }: { site: Site }) {
  const { github, linkedin, instagram, email } = site.links
  return (
    <div className="mt-[18px] flex flex-wrap gap-2.5">
      {github && (
        <a href={github} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub" className={iconClass}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.11-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.19.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.57 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" /></svg>
        </a>
      )}
      {linkedin && (
        <a href={linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn" className={iconClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
        </a>
      )}
      {instagram && (
        <a href={instagram} target="_blank" rel="noopener" aria-label="Instagram" title="Instagram" className={iconClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" {...outline} aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>
        </a>
      )}
      {site.resume && (
        <a href={site.resume} target="_blank" rel="noopener" aria-label="Resume" title="Resume" className={iconClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" {...outline} aria-hidden="true"><path d="M4 3h11l5 5v13H4z" /><path d="M14 3v6h6" /><path d="M8 13h8M8 17h6" /></svg>
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} aria-label="Email" title="Email" className={iconClass}>
          <svg width="18" height="18" viewBox="0 0 24 24" {...outline} aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 6 9 7 9-7" /></svg>
        </a>
      )}
    </div>
  )
}
