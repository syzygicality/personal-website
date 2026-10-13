import SectionHeading from './SectionHeading'

export default function About({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section id="about" className="relative z-2 scroll-mt-22.5 pt-2 pb-12">
      <div className="wrap">
        <SectionHeading title="About" className="mb-7" />
        <div className="text-[15px]/[1.55] text-ink2">
          {paragraphs.map((para, i) => <p key={i} className="mt-0 mb-3.5">{para}</p>)}
        </div>
      </div>
    </section>
  )
}
