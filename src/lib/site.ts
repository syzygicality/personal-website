// Parsed by loaders/yaml-loader.js; importing it (rather than reading with fs) gives hot reload in dev.
import raw from '../../content/site.yaml'

export type Experience = {
  role: string
  company: string
  start: string
  end: string
  current: boolean
  blurb: string
  logo: string
  logoFit: 'cover' | 'contain'
  logoRadius: number
  logoBackground: string
  skills: string[]
}

export type Project = {
  name: string
  url: string
  image: string
  alt: string
  imageFit: 'cover' | 'contain'
  imagePosition: string
  imageBackground: string
  description: string
  tags: string[]
  skills: string[]
}

export type Site = {
  firstName: string
  lastName: string
  fullName: string
  tagline: string
  headshot: string
  resume: string
  links: { github: string; linkedin: string; instagram: string; email: string }
  about: string[]
  skillGroups: { name: string; items: string[] }[]
  experience: Experience[]
  projectsPerRow: number
  projects: Project[]
}

type Raw = Record<string, any>

const arr = (v: unknown): any[] => (Array.isArray(v) ? v : v == null ? [] : [v])
const str = (v: unknown) => (v == null ? '' : String(v).trim())
const fit = (v: unknown) => (v === 'contain' ? 'contain' : 'cover')

// Bare file names in site.yaml are served from public/.
const asset = (v: unknown) => {
  const s = str(v)
  return !s || /^(https?:)?\/\//.test(s) || s.startsWith('/') ? s : '/' + s
}

export function getSite(): Site {
  const name: Raw = raw.name || {}
  const links: Raw = raw.links || {}
  const skills: Raw = raw.skills || {}

  return {
    firstName: str(name.first),
    lastName: str(name.last),
    fullName: [str(name.first), str(name.last)].filter(Boolean).join(' '),
    tagline: str(raw.tagline),
    headshot: asset(raw.headshot),
    resume: asset(raw.resume),
    links: {
      github: str(links.github),
      linkedin: str(links.linkedin),
      instagram: str(links.instagram),
      email: str(links.email),
    },
    about: arr(raw.about).map(str),
    skillGroups: Object.keys(skills).map((k) => ({ name: k, items: arr(skills[k]).map(str) })),
    experience: arr(raw.experience).map((e: Raw) => ({
      role: str(e.role),
      company: str(e.company),
      start: str(e.start),
      end: str(e.end),
      current: str(e.end).toLowerCase() === 'present',
      blurb: str(e.blurb),
      logo: asset(e.logo),
      logoFit: fit(e.logo_fit),
      logoRadius: Number(e.logo_radius) || 0,
      logoBackground: str(e.logo_background) || 'transparent',
      skills: arr(e.skills).map(str),
    })),
    projectsPerRow: Math.max(1, Number(raw.projects_per_row) || 3),
    projects: arr(raw.projects).map((p: Raw) => ({
      name: str(p.name),
      url: str(p.url) || '#',
      image: asset(p.image),
      alt: str(p.image_alt || p.name),
      imageFit: fit(p.image_fit),
      imagePosition: str(p.image_position) || 'center',
      imageBackground: str(p.image_background),
      description: str(p.description),
      tags: arr(p.tags).map(str),
      skills: arr(p.skills).map(str),
    })),
  }
}
