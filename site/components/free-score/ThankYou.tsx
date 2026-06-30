'use client'

// Confirmation popup shown after the lead form. The score is delivered by email
// (the scan runs server-side), so we acknowledge the request here rather than
// rendering it on-page. Clovion brand style: shiny black card, white text, the
// Clovion logo, the single emerald affordance accent.

const LOGO_URL =
  'https://res.cloudinary.com/doajh6jwk/image/upload/v1782804104/Clovion-Logo-white_xoqx8t.png'

export default function ThankYou({
  title,
  body,
  onClose,
}: {
  title: string
  body: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ty-title"
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
        background: 'rgba(4,4,6,0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 428,
          borderRadius: 24,
          overflow: 'hidden',
          padding: '40px 34px 32px',
          textAlign: 'center',
          color: '#ffffff',
          background:
            'radial-gradient(135% 120% at 50% -10%, #20202b 0%, #121219 46%, #0a0a0f 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow:
            '0 30px 80px -24px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        {/* top sheen — the "shine" */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 150,
            pointerEvents: 'none',
            background:
              'radial-gradient(62% 100% at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 72%)',
          }}
        />

        <div style={{ position: 'relative' }}>
          <img
            src={LOGO_URL}
            width={116}
            height={29}
            alt="Clovion AI"
            style={{ display: 'block', width: 116, height: 29, margin: '0 auto 30px', border: 0 }}
          />

          <h2
            id="ty-title"
            style={{
              margin: 0,
              fontSize: '1.3rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
              color: '#ffffff',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              margin: '12px auto 0',
              maxWidth: 328,
              fontSize: '0.92rem',
              lineHeight: 1.62,
              color: 'rgba(255,255,255,0.62)',
            }}
          >
            {body}
          </p>

          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: 28,
              width: '100%',
              height: 48,
              borderRadius: 999,
              border: 0,
              cursor: 'pointer',
              background: '#ffffff',
              color: '#0a0a0f',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
