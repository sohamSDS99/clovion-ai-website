'use client'

// Shared result popup for the free tools — the light Clovion-brand window that
// every tool's result renders into (matches the robots-checker result modal).
// Provides: fixed scrim + blur, scroll-lock, Esc / backdrop / × to close, the
// Clovion mark, and an entrance transition. The tool passes its result body as
// children; the body uses the LIGHT palette (var(--ink) text on var(--white)).

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { HaloMark } from '@/components/ui'

// Inline literal — never put var(--*) inside a transition shorthand.
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

function XIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function ToolResultModal({
  open,
  onClose,
  children,
  maxWidth = 1080
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
  maxWidth?: number
}) {
  // `shown` drives the entrance transition (flips true one frame after mount).
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!open) {
      setShown(false)
      return
    }
    const raf = requestAnimationFrame(() => setShown(true))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const card: CSSProperties = {
    containerType: 'inline-size',
    position: 'relative',
    width: '100%',
    maxWidth,
    maxHeight: '90vh',
    overflowY: 'auto',
    background: 'var(--white)',
    color: 'var(--ink)',
    border: '1px solid var(--line)',
    borderRadius: 24,
    padding: 'clamp(22px, 3.2cqw, 44px)',
    boxShadow: '0 40px 120px -24px rgba(0,0,0,0.28), 0 0 0 1px rgba(10,10,15,0.04)',
    textAlign: 'left',
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity 360ms ${EASE}, transform 360ms ${EASE}`
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(8,8,11,0.6)',
        backdropFilter: 'blur(4px)',
        opacity: shown ? 1 : 0,
        transition: `opacity 240ms ${EASE}`
      }}
    >
      <div style={card}>
        {/* Brand bar — Clovion logo + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 22
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1.05rem' }}>
            <HaloMark size={24} />
            Clovion AI
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 999,
              border: '1px solid var(--line)',
              background: 'var(--subtle)',
              color: 'var(--ink-60)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <XIcon />
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
