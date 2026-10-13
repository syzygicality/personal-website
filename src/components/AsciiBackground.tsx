'use client'

import { useEffect, useRef } from 'react'

const CHARS = ' .:-=+*#%@'
const CHAR_W = 7.2
const LINE_H = 13
const FRAME_MS = 55
const INTENSITY = 0.5

const preClass = 'pointer-events-none absolute inset-0 z-0 m-0 overflow-hidden whitespace-pre font-mono text-[12px]/[13px] text-ink'

/**
 * Animated ASCII plasma behind the hero, fading out below the element with id `boundsId`,
 * plus a brighter copy revealed in a spotlight around the cursor.
 */
export default function AsciiBackground({ boundsId }: { boundsId: string }) {
  const heroRef = useRef<HTMLPreElement>(null)
  const spotRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    let last = 0

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < FRAME_MS) return
      last = now
      const t = now - t0
      const hero = heroRef.current
      if (!hero) return

      const bounds = document.getElementById(boundsId)
      if (bounds) {
        const end = bounds.offsetTop + bounds.offsetHeight
        const mask = `linear-gradient(180deg,#000 0,#000 ${end}px,transparent ${end + 140}px)`
        hero.style.webkitMaskImage = mask
        hero.style.maskImage = mask
      }

      const cols = Math.max(0, Math.floor(hero.clientWidth / CHAR_W))
      const rows = Math.max(0, Math.floor(hero.clientHeight / LINE_H))
      if (cols && rows) {
        let out = ''
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const val =
              Math.sin(x * 0.13 + t * 0.0016) +
              Math.sin(y * 0.19 - t * 0.0012) +
              Math.sin((x + y) * 0.08 + t * 0.0009) +
              Math.sin(Math.hypot(x - cols / 2, (y - rows / 2) * 1.7) * 0.14 - t * 0.0018)
            const n = (val + 4) / 8
            out += CHARS[Math.max(0, Math.min(CHARS.length - 1, Math.floor(n * CHARS.length)))]
          }
          out += '\n'
        }
        hero.textContent = out
      }
      hero.style.opacity = String(0.16 + INTENSITY * 0.22)
      if (spotRef.current) spotRef.current.textContent = hero.textContent
    }
    raf = requestAnimationFrame(frame)

    let lastX: number | null = null
    let lastY = 0
    let idle: ReturnType<typeof setTimeout> | undefined
    const updateMask = (clientX: number, clientY: number) => {
      const el = spotRef.current
      if (!el) return
      const mask = `radial-gradient(90px circle at ${clientX + window.scrollX}px ${clientY + window.scrollY}px, #000 0%, transparent 72%)`
      el.style.webkitMaskImage = mask
      el.style.maskImage = mask
    }
    const onMove = (e: MouseEvent) => {
      lastX = e.clientX
      lastY = e.clientY
      const el = spotRef.current
      if (!el) return
      updateMask(e.clientX, e.clientY)
      el.style.opacity = '0.45'
      clearTimeout(idle)
      idle = setTimeout(() => { if (spotRef.current) spotRef.current.style.opacity = '0' }, 900)
    }
    const onScroll = () => { if (lastX != null) updateMask(lastX, lastY) }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(idle)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [boundsId])

  return (
    <>
      <pre ref={heroRef} aria-hidden="true" className={`${preClass} opacity-14`} />
      <pre ref={spotRef} aria-hidden="true" className={`${preClass} opacity-0 transition-opacity duration-350`} />
    </>
  )
}
