import type { CSSProperties } from 'react'

// "Our Partners" — a static row of brand logos on the light pricing page.
// Each knockout PNG (transparent 800×200 silhouette) is used as an alpha mask
// and filled with the brand's exact company color, so the monochrome asset
// renders in full brand colour on the light background. Same technique as the
// homepage LogoMarquee.
const LOGOS: { name: string; src: string; color: string; transform?: string }[] = [
  { name: 'Unilever', src: '/logos/ko-unilever.png', color: '#1F36C7' },
  { name: 'Canon', src: '/logos/ko-canon.png', color: '#CC0000' },
  { name: 'DHL', src: '/logos/ko-dhl.png', color: '#D40511' },
  { name: 'Netpower', src: '/logos/ko-netpower.png', color: '#0070A8' },
  // Reckitt's knockout reads small + sits low in its canvas — scale up + nudge.
  { name: 'Reckitt', src: '/logos/ko-reckitt.png', color: '#FF007F', transform: 'translateY(-8%) scale(1.15)' },
]

const P_CONTAINER: CSSProperties = {
  maxWidth: 1080,
  margin: '0 auto',
  padding: '0 1.5rem',
}

function LogoLockup({ logo }: { logo: (typeof LOGOS)[number] }) {
  return (
    <span
      role="img"
      aria-label={logo.name}
      title={logo.name}
      style={{
        display: 'block',
        width: 'clamp(56px, 18vw, 200px)',
        aspectRatio: '4 / 1',
        flexShrink: 1,
        minWidth: 0,
        transform: logo.transform,
        backgroundColor: logo.color,
        WebkitMaskImage: `url(${logo.src})`,
        maskImage: `url(${logo.src})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}

export default function OurPartners() {
  return (
    <section style={{ ...P_CONTAINER, marginTop: 88 }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.875rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          color: 'var(--ink)',
          margin: '0 0 40px',
        }}
      >
        Our Partners
      </h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'clamp(10px, 2vw, 28px)',
        }}
      >
        {LOGOS.map((logo) => (
          <LogoLockup key={logo.name} logo={logo} />
        ))}
      </div>
    </section>
  )
}
