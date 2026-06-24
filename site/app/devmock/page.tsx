'use client'
// TEMP preview route for verifying MockVisibility — deleted before commit.
import { MockVisibility } from '../../components/home/mocks/MockVisibility'

export default function DevMock() {
  return (
    <div style={{ background: '#08080b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 1100, aspectRatio: '1864 / 1075', borderRadius: 18, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <MockVisibility show={true} />
      </div>
    </div>
  )
}
