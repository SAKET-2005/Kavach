import { useState } from 'react';

export default function ClaimsTable({ claims }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const getFraudColor = (score) => {
    if (score < 30) return 'var(--green-mid)';
    if (score <= 70) return 'var(--orange)';
    return 'var(--red)';
  };

  const getStatusPill = (status) => {
    switch (status) {
      case 'Approved': return 'pill pill-green-dark';
      case 'Pending':  return 'pill pill-amber-dark';
      case 'Rejected': return 'pill pill-red-dark';
      default:         return 'pill';
    }
  };

  const renderSignals = (signals) => {
    const signalNames = {
      gps: 'GPS zone match',
      activity: 'Activity check',
      duplicate: 'Duplicate check',
      velocity: 'Claim velocity',
      accountAge: 'Account age',
    };

    const totalScore = Object.values(signals).reduce((sum, s) => sum + s.score, 0);
    const decision = totalScore < 30 ? 'AUTO_APPROVE' : totalScore < 70 ? 'MANUAL_REVIEW' : 'AUTO_REJECT';

    return (
      <div
        style={{
          background: 'var(--charcoal)',
          borderRadius: '10px',
          padding: '16px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: 1.8,
          color: 'var(--charcoal-muted)',
          marginTop: '12px',
        }}
      >
        {Object.entries(signals).map(([key, signal]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              {signalNames[key]}:{' '}
              <span style={{ marginLeft: '8px' }}>
                {signal.pass ? '✅ Pass' : '⚠️ Flag'}
              </span>
            </span>
            <span style={{ color: signal.score > 0 ? 'var(--orange)' : 'var(--charcoal-muted)' }}>
              (+{signal.score}){signal.note ? ` — ${signal.note}` : ''}
            </span>
          </div>
        ))}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: '8px',
            paddingTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 600,
          }}
        >
          <span>Total fraud score:</span>
          <span style={{ color: getFraudColor(totalScore) }}>
            {totalScore} / 100 → {decision}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-card">
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          color: '#fff',
          marginBottom: '16px',
        }}
      >
        Claims
      </h3>

      {/* Table header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 90px 140px 90px 90px 100px 70px',
          gap: '8px',
          padding: '10px 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--charcoal-muted)',
        }}
      >
        <span>Worker ID</span>
        <span>City</span>
        <span>Trigger</span>
        <span>Amount</span>
        <span>Fraud</span>
        <span>Status</span>
        <span>Time</span>
      </div>

      {/* Table rows */}
      {claims.map((claim) => (
        <div key={claim.id}>
          <div
            onClick={() => setExpandedRow(expandedRow === claim.id ? null : claim.id)}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 90px 140px 90px 90px 100px 70px',
              gap: '8px',
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'var(--transition)',
              alignItems: 'center',
              background: expandedRow === claim.id ? 'rgba(255,255,255,0.02)' : 'transparent',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = expandedRow === claim.id ? 'rgba(255,255,255,0.02)' : 'transparent')}
          >
            <span style={{ fontFamily: 'var(--font-mono)', color: '#D1D5DB' }}>{claim.id}</span>
            <span style={{ color: '#D1D5DB' }}>{claim.city}</span>
            <span style={{ color: '#D1D5DB' }}>{claim.trigger}</span>
            <span className="rupee" style={{ color: '#D1D5DB' }}>
              {claim.amount > 0 ? `₹${claim.amount}` : '—'}
            </span>
            <span
              className="rupee"
              style={{ color: getFraudColor(claim.fraudScore), fontWeight: 600 }}
            >
              {claim.fraudScore}
            </span>
            <span className={getStatusPill(claim.status)}>{claim.status}</span>
            <span style={{ color: 'var(--charcoal-muted)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              {claim.time}
            </span>
          </div>

          {/* Expanded row */}
          {expandedRow === claim.id && (
            <div style={{ padding: '4px 0 16px' }}>{renderSignals(claim.signals)}</div>
          )}
        </div>
      ))}
    </div>
  );
}
