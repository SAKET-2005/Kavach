export default function ShieldCard({ worker }) {
  const { policy } = worker;

  return (
    <div
      className="card"
      style={{
        background: 'var(--text-primary)',
        color: '#fff',
        padding: '28px',
        borderRadius: 'var(--radius-card)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
      }}
    >
      {/* Left side - Policy info */}
      <div style={{ flex: '1 1 300px' }}>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'var(--charcoal-muted)',
            marginBottom: '4px',
          }}
        >
          YOUR KAVACH SHIELD
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {policy.tier}
          <span
            className="pill"
            style={{
              background: 'rgba(27,127,79,0.2)',
              color: '#2EA36A',
              fontSize: '11px',
              padding: '3px 10px',
            }}
          >
            {policy.status}
          </span>
        </h2>

        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(255,255,255,0.1)',
            margin: '16px 0',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Coverage this week</span>
            <span className="rupee" style={{ fontSize: '18px', fontWeight: 700 }}>
              ₹{policy.coverage.toLocaleString('en-IN')}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Weekly premium</span>
            <span className="rupee" style={{ fontSize: '18px', fontWeight: 700 }}>
              ₹{policy.premium}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px' }}>Renews</span>
            <span style={{ fontSize: '14px' }}>Sunday · {policy.renewsIn} days</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" style={{ fontSize: '14px', padding: '10px 20px' }}>
            Upgrade to Pro
          </button>
          <button className="btn btn-ghost" style={{ fontSize: '14px', padding: '10px 20px' }}>
            View Full Policy
          </button>
        </div>
      </div>

      {/* Right side - Animated Shield SVG */}
      <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          width="48"
          height="56"
          viewBox="0 0 48 56"
          fill="none"
          style={{ animation: 'shieldPulse 3s ease-in-out infinite' }}
        >
          <path d="M24 2L4 10v18c0 12.5 8.5 24.2 20 28 11.5-3.8 20-15.5 20-28V10L24 2z"
            fill="none" stroke="var(--green-primary)" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M24 2L4 10v18c0 12.5 8.5 24.2 20 28 11.5-3.8 20-15.5 20-28V10L24 2z"
            fill="var(--green-primary)" fillOpacity="0.15"/>
        </svg>
      </div>
    </div>
  );
}
