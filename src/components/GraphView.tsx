'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D, { type ForceGraphMethods, type LinkObject, type NodeObject } from 'react-force-graph-2d'
import { spaceMono } from '@/app/fonts'
import { PALETTE, inkA } from '@/lib/palette'
import type { Site } from '@/lib/site'

type NodeType = 'experience' | 'project' | 'skill'
type GraphNode = NodeObject<{ id: string; type: NodeType; label: string; val: number }>
type GraphLink = LinkObject<GraphNode>
type Highlight = { nodes: Set<string>; links: Set<GraphLink>; focusId: string | null } | null

const NAV_HEIGHT = 64
const FONT = spaceMono.style.fontFamily

const nodeColor = (n: GraphNode) => (n.type === 'skill' ? PALETTE.acc2 : n.type === 'project' ? PALETTE.acc : PALETTE.ink)
const nodeRadius = (n: GraphNode) => 3 + 2.1 * Math.sqrt(n.val || 1)
const idOf = (end: GraphLink['source']) => String(typeof end === 'object' ? end?.id : end)

function buildGraph(site: Site) {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []
  const skillIds: Record<string, string> = {}

  const skills = new Set([...site.experience.flatMap((e) => e.skills), ...site.projects.flatMap((p) => p.skills)])
  skills.forEach((name) => {
    skillIds[name] = 'skill:' + name
    nodes.push({ id: skillIds[name], type: 'skill', label: name, val: 2 })
  })
  site.experience.forEach((e, i) => {
    const id = 'exp' + i
    nodes.push({ id, type: 'experience', label: `${e.role} @ ${e.company}`, val: 6 })
    e.skills.forEach((s) => links.push({ source: id, target: skillIds[s] }))
  })
  site.projects.forEach((p, i) => {
    const id = 'proj' + i
    nodes.push({ id, type: 'project', label: p.name, val: 8 })
    p.skills.forEach((s) => links.push({ source: id, target: skillIds[s] }))
  })

  const linked = new Set(links.flatMap((l) => [idOf(l.source), idOf(l.target)]))
  return { nodes: nodes.filter((n) => n.type !== 'skill' || linked.has(n.id)), links }
}

// Pushes apart nodes whose label boxes overlap.
function labelCollide() {
  let nodes: GraphNode[] = []
  const halfW = (n: GraphNode) => Math.max(34, n.label.length * (n.type === 'skill' ? 7.4 : 8) + 22)
  const halfH = 36
  const force = (alpha: number) => {
    const k = 0.6 * alpha + 0.55
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j]
        const dx = b.x! - a.x!, dy = b.y! - a.y!
        const mx = halfW(a) + halfW(b), my = halfH * 2
        const ox = mx - Math.abs(dx), oy = my - Math.abs(dy)
        if (ox <= 0 || oy <= 0) continue
        if (ox / mx < oy / my) {
          const push = (ox / 2) * k * (dx < 0 ? -1 : 1)
          a.vx! -= push; b.vx! += push
        } else {
          const push = (oy / 2) * k * (dy < 0 ? -1 : 1)
          a.vy! -= push; b.vy! += push
        }
      }
    }
  }
  force.initialize = (ns: GraphNode[]) => { nodes = ns }
  return force
}

const LEGEND: { type: NodeType; label: string; color: string }[] = [
  { type: 'experience', label: 'Experience', color: 'bg-ink' },
  { type: 'project', label: 'Project', color: 'bg-acc' },
  { type: 'skill', label: 'Skill', color: 'bg-acc2' },
]

export default function GraphView({ site }: { site: Site }) {
  const graphData = useMemo(() => buildGraph(site), [site])
  const fgRef = useRef<ForceGraphMethods<GraphNode> | undefined>(undefined)
  const [size, setSize] = useState({ width: 900, height: 600 })
  const [selId, setSelId] = useState<string | null>(null)
  const [legendType, setLegendType] = useState<NodeType | null>(null)

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight - NAV_HEIGHT })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Tune the simulation once the graph instance exists.
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return
    const small = Math.min(window.innerWidth, window.innerHeight - NAV_HEIGHT) < 700
    fg.d3Force('charge')?.strength(small ? -380 : -700).distanceMax(1200)
    fg.d3Force('link')?.distance(200).strength(0.12)
    fg.d3Force('collide', labelCollide())
    fg.d3Force('center')?.strength?.(0.04)
    fg.d3ReheatSimulation()
  }, [])

  const hl = useMemo<Highlight>(() => {
    if (!selId && !legendType) return null
    const nodes = new Set<string>()
    const links = new Set<GraphLink>()
    if (selId) {
      nodes.add(selId)
      graphData.links.forEach((l) => {
        const s = idOf(l.source), t = idOf(l.target)
        if (s === selId || t === selId) { links.add(l); nodes.add(s); nodes.add(t) }
      })
    }
    if (legendType) {
      graphData.nodes.forEach((n) => { if (n.type === legendType) nodes.add(n.id) })
      graphData.links.forEach((l) => { if (nodes.has(idOf(l.source)) && nodes.has(idOf(l.target))) links.add(l) })
    }
    return { nodes, links, focusId: selId }
  }, [graphData, selId, legendType])

  const linkColor = useCallback((l: GraphLink) => (!hl ? inkA(.28) : hl.links.has(l) ? inkA(.6) : inkA(.07)), [hl])
  const linkWidth = useCallback((l: GraphLink) => (hl?.links.has(l) ? 1.8 : 1), [hl])

  // Dot grid behind the graph that stays evenly spaced on screen as you zoom.
  const drawDots = useCallback((ctx: CanvasRenderingContext2D, scale: number) => {
    const fg = fgRef.current
    if (!fg || !isFinite(scale) || scale <= 0) return
    const tl = fg.screen2GraphCoords(0, 0), br = fg.screen2GraphCoords(size.width, size.height)
    if (![tl.x, tl.y, br.x, br.y].every(isFinite)) return
    let step = 32
    while (step * scale < 10 && step < 4096) step *= 2
    const x0 = Math.floor(tl.x / step) * step, y0 = Math.floor(tl.y / step) * step
    ctx.fillStyle = inkA(.16)
    for (let x = x0; x <= br.x; x += step) {
      for (let y = y0; y <= br.y; y += step) {
        ctx.beginPath()
        ctx.arc(x, y, 1 / scale, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }, [size, hl]) // hl is a dep so the callback gets a fresh identity, which forces a canvas redraw

  const drawNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, scale: number) => {
    if (!Number.isFinite(node.x) || !Number.isFinite(node.y) || !isFinite(scale) || scale <= 0) return
    const x = node.x!, y = node.y!
    const faded = hl && !hl.nodes.has(node.id)
    const isFocus = hl?.focusId === node.id
    const r = (nodeRadius(node) * (isFocus ? 1.35 : 1)) / scale
    ctx.save()
    ctx.globalAlpha = faded ? 0.18 : 1
    if (isFocus) {
      ctx.beginPath()
      ctx.arc(x, y, r + 5 / scale, 0, 2 * Math.PI)
      ctx.strokeStyle = nodeColor(node)
      ctx.lineWidth = 1 / scale
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = nodeColor(node)
    ctx.fill()
    ctx.lineWidth = 2 / scale
    ctx.strokeStyle = PALETTE.bg
    ctx.stroke()
    // Labels are constant screen size while collide reserves graph units:
    // at low zoom there isn't room for every label, so skills thin out.
    if (node.type !== 'skill' || scale > 0.45 || hl?.nodes.has(node.id)) {
      const fs = (node.type === 'skill' ? 10 : 11.5) / scale
      ctx.font = `700 ${fs}px ${FONT}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillStyle = PALETTE.ink
      const parts = node.type === 'experience' && node.label.includes(' @ ')
        ? node.label.split(' @ ').map((t, i) => (i ? '@ ' + t : t))
        : [node.label]
      parts.forEach((t, i) => ctx.fillText(t, x, y + r + 3 / scale + i * fs * 1.15))
    }
    ctx.restore()
  }, [hl])

  const paintPointerArea = useCallback((node: GraphNode, color: string, ctx: CanvasRenderingContext2D, scale: number) => {
    ctx.beginPath()
    ctx.arc(node.x!, node.y!, nodeRadius(node) / (scale || 1) + 2, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
  }, [])

  return (
    <section className="relative mt-16 h-[calc(100vh-64px)] overflow-hidden bg-bg">
      <div className="absolute top-3.5 left-5 z-2 flex gap-4.5 border border-ink/12 bg-bg px-3 py-2 font-mono text-xs tracking-[.06em] text-ink/60 md:left-19">
        {LEGEND.map(({ type, label, color }) => (
          <button
            key={type}
            type="button"
            onClick={() => { setLegendType((t) => (t === type ? null : type)); setSelId(null) }}
            className="flex cursor-pointer appearance-none items-center gap-1.5 border-0 bg-transparent p-0 transition-colors duration-150 hover:text-ink"
          >
            <span className={`inline-block size-2.25 rounded-full ${color}`} />
            {label}
            {legendType === type && <span className="inline-block size-1.25 rounded-full bg-acc" />}
          </button>
        ))}
      </div>
      <ForceGraph2D<GraphNode>
        ref={fgRef}
        graphData={graphData}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        nodeRelSize={1}
        nodeLabel={(n) => n.label}
        linkColor={linkColor}
        linkWidth={linkWidth}
        cooldownTicks={400}
        d3VelocityDecay={0.32}
        onRenderFramePre={drawDots}
        nodeCanvasObject={drawNode}
        nodePointerAreaPaint={paintPointerArea}
        onNodeClick={(n) => { setSelId((s) => (s === n.id ? null : n.id)); setLegendType(null) }}
        onBackgroundClick={() => { setSelId(null); setLegendType(null) }}
        onNodeDragEnd={(n) => { n.fx = undefined; n.fy = undefined }}
      />
    </section>
  )
}
