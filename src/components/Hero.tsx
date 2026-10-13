import Image from 'next/image'
import type { Site } from '@/lib/site'
import SocialLinks from './SocialLinks'

export default function Hero({ site }: { site: Site }) {
  return (
    <section id="hero" className="relative overflow-hidden pt-26 pb-6">
      <div className="wrap relative z-2 grid items-center gap-9 md:grid-cols-[.9fr_1.35fr]">
        <div className="relative md:order-2">
          <div
            aria-hidden="true"
            className="absolute top-[-45%] left-[-55%] -z-1 h-[190%] w-[210%] bg-[radial-gradient(58%_52%_at_50%_50%,var(--bg)_0%,color-mix(in_srgb,var(--bg)_90%,transparent)_42%,transparent_74%)]"
          />
          <h1 className="m-0 text-[clamp(46px,7.5vw,112px)]/[.9] font-bold tracking-[-.035em]">
            {site.firstName}
            <br />
            <span className="animate-gradient-shift bg-linear-[120deg] from-acc2 via-acc to-acc2 bg-size-[200%_100%] bg-clip-text text-transparent">
              {site.lastName}
            </span>
          </h1>
          <p className="mt-4.5 mb-0 max-w-105 text-base/normal text-ink2">{site.tagline}</p>
          <SocialLinks site={site} />
        </div>
        <div className="w-full max-w-70 justify-self-start md:order-1">
          <div className="relative aspect-4/5 overflow-hidden border border-ink bg-card">
            {site.headshot && (
              <Image
                src={site.headshot}
                alt={site.fullName}
                fill
                priority
                sizes="280px"
                className="object-cover object-[center_30%]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
