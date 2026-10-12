import type { Metadata } from 'next'
import { spaceMono } from './fonts'
import { getSite } from '@/lib/site'
import './globals.css'

export function generateMetadata(): Metadata {
  const site = getSite()
  return { title: site.fullName, description: site.tagline }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
