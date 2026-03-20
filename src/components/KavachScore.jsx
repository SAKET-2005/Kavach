import { useState, useEffect } from 'react';

export default function KavachScore({ score, size = 160, strokeWidth = 10, showLabel = true, labelText = '' }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = animatedScore / 100;
  const offset = circumference - scorePercent * circumference;

  const getColor = (s) => {
    if (s < 40) return 'var(--green-primary)';
    if (s <= 70) return 'var(--orange)';
    return 'var(--red)';
  };

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * score);
      setAnimatedScore(start);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.1s ease' }}
        />
        {/* Score number */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={getColor(score)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: `${size * 0.22}px`,
            fontWeight: 700,
          }}
        >
          {animatedScore}
        </text>
      </svg>
      {showLabel && labelText && (
        <p className="text-muted text-center" style={{ maxWidth: '260px' }}>
          {labelText}
        </p>
      )}
    </div>
  );
}
