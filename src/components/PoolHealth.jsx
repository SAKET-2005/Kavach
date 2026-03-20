export default function PoolHealth({ pool }) {
  const { collected, paidOut, lossRatio } = pool;
  const isHealthy = lossRatio < 70;

  return (
    <div className="admin-card">
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          color: '#fff',
          marginBottom: '24px',
        }}
      >
        Premium Pool Health
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Collected */}
        <div>
          <span style={{ fontSize: '12px', color: 'var(--charcoal-muted)', display: 'block', marginBottom: '4px' }}>
            Collected this week
          </span>
          <span
            className="rupee"
            style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}
          >
            ₹{collected.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Paid out */}
        <div>
          <span style={{ fontSize: '12px', color: 'var(--charcoal-muted)', display: 'block', marginBottom: '4px' }}>
            Paid out
          </span>
          <span
            className="rupee"
            style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}
          >
            ₹{paidOut.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Loss ratio */}
        <div>
          <span style={{ fontSize: '12px', color: 'var(--charcoal-muted)', display: 'block', marginBottom: '4px' }}>
            Loss ratio
          </span>
          <span
            className="rupee"
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: isHealthy ? 'var(--green-mid)' : 'var(--red)',
            }}
          >
            {lossRatio}% {isHealthy ? '✅' : '⚠️'}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: `${lossRatio}%`,
                height: '100%',
                background: isHealthy
                  ? 'var(--green-primary)'
                  : 'var(--red)',
                borderRadius: '4px',
                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--charcoal-muted)' }}>
            Reinsurance threshold at 70% — currently {lossRatio}%
          </p>
        </div>
      </div>
    </div>
  );
}
