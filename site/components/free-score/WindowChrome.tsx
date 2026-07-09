'use client'

import type { ReactNode } from 'react'

type WindowChromeProps = {
  label: string
  children: ReactNode
  dark?: boolean
}

export default function WindowChrome({ label, children }: WindowChromeProps) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        boxShadow: '0 30px 80px -40px rgba(10,10,15,0.25)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fecdd3' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fde68a' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#a7f3d0' }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--ink-50)'
          }}
        >
          {label}
        </div>
        <div style={{ width: 24 }} />
      </div>
      {children}
    </div>
  )
}
