type GaugeArcProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
};

export default function GaugeArc({ value, size = 120, strokeWidth = 8 }: GaugeArcProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius * 2;
  const offset = circumference - (value / 100) * circumference;

  const y = size / 2;

  return (
    <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
      {/* Background Arc (gray) */}
      <path
        d={`M ${strokeWidth / 2} ${y} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${y}`}
        fill="none"
        stroke="#e5e8eb"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Progress Arc (gradient: pink to purple) */}
      <defs>
        <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff85d1" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        d={`M ${strokeWidth / 2} ${y} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${y}`}
        fill="none"
        stroke="url(#arcGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
