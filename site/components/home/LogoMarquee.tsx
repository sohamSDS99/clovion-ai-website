'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, ArrowRight } from '@/components/ui'

const LOGOS = [
  { name: 'Netpower', src: '/logos/ko-netpower.png' },
  { name: 'SDS Manager', src: '/logos/ko-sdsmanager.png' },
  { name: 'Canon', src: '/logos/ko-canon.png' },
  { name: 'Unilever', src: '/logos/ko-unilever.png' },
  { name: 'DHL', src: '/logos/ko-dhl.png' },
  { name: 'Reckitt', src: '/logos/ko-reckitt.png' }
]

function LogoLockup({ logo }: { logo: (typeof LOGOS)[number] }) {
  const [hover, setHover] = useState(false)
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 40px',
        flexShrink: 0
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        style={{
          maxHeight: 96,
          maxWidth: 260,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          opacity: hover ? 1 : 0.85,
          transform: hover ? 'translateY(-2px)' : 'none',
          transition: 'opacity 0.25s ease, transform 0.25s ease'
        }}
      />
    </span>
  )
}

export function LogoMarquee() {
  const [reduce, setReduce] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const track = [...LOGOS, ...LOGOS]
  return (
    <section
      style={{
        padding: '3.25rem 0',
        background: 'var(--subtle)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)'
      }}
    >
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 30 }}>
          <span aria-hidden style={{ height: 1, width: 36, background: 'var(--line)' }} />
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              textTransform: 'uppercase',
              letterSpacing: '0.16em',
              color: 'var(--ink-50)'
            }}
          >
            Trusted by teams that move fast
          </p>
          <span aria-hidden style={{ height: 1, width: 36, background: 'var(--line)' }} />
        </div>
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            position: 'relative',
            overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
            maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              animation: reduce ? 'none' : 'clv-marquee 34s linear infinite',
              animationPlayState: paused ? 'paused' : 'running'
            }}
          >
            {track.map((logo, i) => (
              <LogoLockup key={logo.name + i} logo={logo} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: 30, textAlign: 'center' }}>
          <Link
            href="/customers"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--ink)',
              textDecoration: 'none'
            }}
          >
            Read customer stories <ArrowRight />
          </Link>
        </div>
      </Container>
    </section>
  )
}
