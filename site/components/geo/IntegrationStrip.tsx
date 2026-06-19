'use client';

const STACK = ['Editorial Engine CMS', 'Slack alerts', 'Teams alerts', 'Webhook', 'REST API'];

export default function IntegrationStrip() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
      {STACK.map((s) => (
        <span
          key={s}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 9,
            padding: '13px 20px',
            borderRadius: 999,
            background: 'var(--white)',
            border: '1px solid var(--line)',
            boxShadow: 'var(--shadow-card)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            fontWeight: 600,
            color: 'var(--ink)',
          }}
        >
          <span
            style={{
              height: 7,
              width: 7,
              borderRadius: 2,
              background: 'var(--ink)',
            }}
          />
          {s}
        </span>
      ))}
    </div>
  );
}
