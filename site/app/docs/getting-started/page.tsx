import type { Metadata } from 'next'
import DocsGettingStarted from './DocsGettingStarted'

export const metadata: Metadata = {
  title: 'Getting started — Track your first brand | Clovion AI',
  description:
    'Five-minute walkthrough for tracking your first brand across ten AI engines. Workspace setup, competitor seeding, starter prompts, and your first scan.'
}

export default function DocsGettingStartedPage() {
  return <DocsGettingStarted />
}
