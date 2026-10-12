'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'

export type View = 'normal' | 'graph'

type ViewState = {
  view: View
  setView: (view: View) => void
  /** Leave the graph view and scroll to a section of the page. */
  goToSection: (id: string) => void
}

const ViewContext = createContext<ViewState | null>(null)

export function useView() {
  const ctx = useContext(ViewContext)
  if (!ctx) throw new Error('useView must be used inside <ViewProvider>')
  return ctx
}

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>('normal')
  const pendingScroll = useRef<string | null>(null)

  useEffect(() => {
    const id = pendingScroll.current
    if (view !== 'normal' || !id) return
    pendingScroll.current = null
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) window.scrollTo({ top: id === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' })
    }))
  }, [view])

  const goToSection = (id: string) => {
    pendingScroll.current = id
    setView('normal')
  }

  return <ViewContext.Provider value={{ view, setView, goToSection }}>{children}</ViewContext.Provider>
}

/** Renders `normal` or `graph` depending on the current view. */
export function ViewSwitch({ normal, graph }: { normal: React.ReactNode; graph: React.ReactNode }) {
  return useView().view === 'graph' ? graph : normal
}
