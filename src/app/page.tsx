import About from '@/components/About'
import AsciiBackground from '@/components/AsciiBackground'
import Experience from '@/components/Experience'
import Graph from '@/components/Graph'
import Hero from '@/components/Hero'
import Nav from '@/components/Nav'
import Projects from '@/components/Projects'
import { ViewProvider, ViewSwitch } from '@/components/ViewContext'
import ViewToggle from '@/components/ViewToggle'
import { getSite } from '@/lib/site'

function Ruler() {
  return <div className="wrap"><div aria-hidden="true" className="ruler" /></div>
}

export default function Home() {
  const site = getSite()

  return (
    <ViewProvider>
      <Nav fullName={site.fullName} />
      <div id="top" />
      <ViewToggle />
      <ViewSwitch
        normal={
          <div className="relative">
            <AsciiBackground boundsId="hero" />
            <Hero site={site} />
            <About paragraphs={site.about} />
            <Ruler />
            <Experience site={site} />
            <Ruler />
            <Projects projects={site.projects} perRow={site.projectsPerRow} />
            <footer className="relative z-2 h-30 bg-ink" />
          </div>
        }
        graph={<Graph site={site} />}
      />
    </ViewProvider>
  )
}
