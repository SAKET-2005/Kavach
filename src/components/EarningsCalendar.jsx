import { useState } from 'react';

export default function EarningsCalendar({ earnings, month = 'July 2025' }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Determine the starting weekday offset (for July 2025, starts on Tuesday = index 1)
  const startOffset = 1;

  const getCellStyle = (type) => {
    const base = {
      width: '40px',
      height: '40px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      cursor: 'default',
      position: 'relative',
      transition: 'var(--transition)',
    };

    switch (type) {
      case 'earned':
        return { ...base, background: '#C6F0D8', color: '#fff' };
      case 'disrupted':
        return { ...base, background: '#FBBCBC', color: '#fff' };
      case 'kavach_paid':
        return { ...base, background: '#BFDBFE', color: '#fff' };
      default:
        return { ...base, background: 'var(--bg-subtle)', color: '#6B6B6B' };
    }
  };

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>
          Your Earnings History
        </h3>
        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>
          {month}
        </span>
      </div>

      {/* Weekday headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 36px)',
          gap: '6px',
          justifyContent: 'start',
          marginBottom: '6px',
        }}
      >
        {weekdays.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--text-muted)',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 36px)',
          gap: '6px',
          justifyContent: 'start',
        }}
      >
        {/* Offset cells */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} style={{ width: '40px', height: '40px' }} />
        ))}

        {/* Day cells */}
        {earnings.map((dayData) => (
          <div
            key={dayData.day}
            className="tooltip-wrapper"
            onMouseEnter={() => setHoveredDay(dayData.day)}
            onMouseLeave={() => setHoveredDay(null)}
            style={getCellStyle(dayData.type)}
          >
            {/* Shield icon for kavach-paid days */}
            {dayData.type === 'kavach_paid' && (
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '14px',
                  zIndex: 1,
                }}
              >
                🛡️
              </span>
            )}
            <span style={{ position: 'relative', zIndex: 2 }}>{dayData.type === 'kavach_paid' ? '' : dayData.day}</span>

            {/* Tooltip */}
            {hoveredDay === dayData.day && dayData.type !== 'none' && (
              <div className="tooltip" style={{ opacity: 1 }}>
                {dayData.type === 'kavach_paid'
                  ? `₹${dayData.amount} paid · ${dayData.event} · Jul ${dayData.day}`
                  : dayData.type === 'disrupted'
                  ? `Disruption · ${dayData.event} · Jul ${dayData.day}`
                  : `₹${dayData.amount} earned · Jul ${dayData.day}`}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '16px',
          flexWrap: 'wrap',
        }}
      >
        {[
          { color: '#C6F0D8', label: 'Worked' },
          { color: '#FBBCBC', label: 'Disrupted' },
          { color: '#BFDBFE', label: 'Kavach paid' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: item.color,
              }}
            />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
