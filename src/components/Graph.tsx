'use client'

import dynamic from 'next/dynamic'

// force-graph touches window on import, so it can only load in the browser.
const Graph = dynamic(() => import('./GraphView'), { ssr: false })

export default Graph
