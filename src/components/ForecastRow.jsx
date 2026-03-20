import { useState } from 'react';

export default function ForecastRow({ forecast }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const getRiskColor = (risk) => {
    if (risk === 'clear') return 'var(--green-primary)';
    if (risk === 'watch') return 'var(--orange)';
    return 'var(--red)';
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
        This Week's Protection
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          textAlign: 'center',
        }}
      >
        {forecast.map((day, i) => (
          <div
            key={day.day}
            className="tooltip-wrapper"
            onMouseEnter={() => setHoveredDay(i)}
            onMouseLeave={() => setHoveredDay(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 4px',
              borderRadius: '12px',
              transition: 'var(--transition)',
              background: hoveredDay === i ? 'var(--bg-subtle)' : 'transparent',
              cursor: 'default',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
              }}
            >
              {day.day}
            </span>

            <div style={{ position: 'relative' }}>
              {day.risk === 'alert' && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '11px',
                  }}
                >
                  ⚡
                </span>
              )}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: getRiskColor(day.risk),
                  transition: 'var(--transition)',
                  transform: hoveredDay === i ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            </div>

            <span
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                color: getRiskColor(day.risk),
              }}
            >
              {day.label}
            </span>

            {/* Tooltip */}
            {(day.risk === 'alert') && (
              <div className="tooltip" style={{ opacity: hoveredDay === i ? 1 : 0 }}>
                IMD Red Alert forecast · Trigger may fire
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
