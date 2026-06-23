'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, ArrowRight } from '@/components/ui'

const LOGOS = [
  { name: 'Canon', src: '/logos/ko-canon.png' },
  { name: 'DHL', src: '/logos/ko-dhl.png' },
  { name: 'Netpower', src: '/logos/ko-netpower.png' },
  { name: 'Reckitt', src: '/logos/ko-reckitt.png' },
  { name: 'SDS Manager', src: '/logos/ko-sdsmanager.png' },
  { name: 'Unilever', src: '/logos/ko-unilever.png' }
]

function LogoLockup({ logo }: { logo: (typeof LOGOS)[number] }) {
  const [hover, setHover] = useState(false)
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="px-6 md:px-10 inline-flex items-center justify-center shrink-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.name}
        loading="lazy"
        decoding="async"
        className="h-[40px] md:h-[56px] w-auto object-contain block"
        style={{
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
      className="py-10 md:py-14"
      style={{
        background: 'linear-gradient(to bottom, var(--bg) 0%, var(--subtle) 14%, var(--subtle) 86%, var(--bg) 100%)'
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
