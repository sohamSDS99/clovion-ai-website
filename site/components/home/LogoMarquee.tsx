import Link from 'next/link'
import { Container, ArrowRight } from '@/components/ui'

// Each knockout PNG is a transparent 800×200 (4:1) silhouette, tinted to the
// brand's exact company color by using the PNG as an alpha mask and filling the
// shape with `backgroundColor`. Solid, flat, full-opacity — no shading/fade.
const LOGOS: { name: string; src: string; color: string; transform?: string }[] = [
  { name: 'Unilever', src: '/logos/ko-unilever.png', color: '#1F36C7' },
  { name: 'Canon', src: '/logos/ko-canon.png', color: '#CC0000' },
  { name: 'DHL', src: '/logos/ko-dhl.png', color: '#D40511' },
  { name: 'Netpower', src: '/logos/ko-netpower.png', color: '#0070A8' },
  // Reckitt's knockout reads small + sits low in its canvas — scale up + nudge up to match the row.
  { name: 'Reckitt', src: '/logos/ko-reckitt.png', color: '#FF007F', transform: 'translateY(-8%) scale(1.15)' }
]

function LogoLockup({ logo }: { logo: (typeof LOGOS)[number] }) {
  return (
    <span
      role="img"
      aria-label={logo.name}
      title={logo.name}
      style={{
        display: 'block',
        // width-driven + responsive so all five shrink to stay on one row
        width: 'clamp(56px, 18vw, 224px)',
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
        maskSize: 'contain'
      }}
    />
  )
}

export function LogoMarquee() {
  return (
    <section className="py-10 md:py-14" data-track-location="home_logo_marquee" style={{ background: '#FAF9F7' }}>
      <Container>
        {/* Left-aligned headline — matches the "Read customer stories" link size (0.9rem / 600). */}
        <div style={{ textAlign: 'left', marginBottom: 30 }}>
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>Trusted partners</p>
        </div>

        {/* Static single row — logos spread evenly across the full width, no wrap, no animation. */}
        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', gap: 'clamp(10px, 2vw, 28px)' }}>
          {LOGOS.map((logo) => (
            <LogoLockup key={logo.name} logo={logo} />
          ))}
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
