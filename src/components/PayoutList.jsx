export default function PayoutList({ payouts }) {
  const getStatusPill = (status) => {
    switch (status) {
      case 'Approved': return 'pill pill-green';
      case 'Pending':  return 'pill pill-amber';
      case 'Rejected': return 'pill pill-red';
      default:         return 'pill';
    }
  };

  const getTriggerIcon = (icon) => {
    switch (icon) {
      case 'rain':   return { emoji: '🌧️', bg: 'var(--green-light)' };
      case 'heat':   return { emoji: '🔥', bg: 'var(--orange-light)' };
      case 'curfew': return { emoji: '🚫', bg: 'var(--red-light)' };
      default:       return { emoji: '⚡', bg: 'var(--bg-subtle)' };
    }
  };

  return (
    <div className="card">
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          marginBottom: '20px',
        }}
      >
        Recent Payouts
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {payouts.map((payout, i) => {
          const iconInfo = getTriggerIcon(payout.icon);
          return (
            <div
              key={payout.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: i < payouts.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'var(--transition)',
              }}
            >
              {/* Left side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: iconInfo.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  {iconInfo.emoji}
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>
                    {payout.trigger}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{payout.date}</p>
                </div>
              </div>

              {/* Right side */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  className="rupee"
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: payout.amount > 0 ? 'var(--green-primary)' : 'var(--text-muted)',
                  }}
                >
                  {payout.amount > 0 ? `₹${payout.amount}` : '—'}
                </span>
                <span className={getStatusPill(payout.status)}>{payout.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
