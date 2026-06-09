import type { Metadata } from 'next'
import BlogIndex from './BlogIndex'

export const metadata: Metadata = {
  title: 'Blog | Clovion AI',
  description:
    'Research, playbooks, and engineering notes on generative engine optimization, AI search citations, and how the major AI engines decide who to cite.'
}

export default function BlogPage() {
  return <BlogIndex />
}
