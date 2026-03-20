export default function StatCard({ label, value, color = 'var(--green-primary)', prefix = '', suffix = '' }) {
  return (
    <div
      className="admin-card"
      style={{
        borderLeft: `3px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--charcoal-muted)',
        }}
      >
        {label}
      </span>
      <span
        className="rupee"
        style={{
          fontSize: '32px',
          fontWeight: 700,
          color: color,
          lineHeight: 1,
        }}
      >
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
      </span>
    </div>
  );
}
