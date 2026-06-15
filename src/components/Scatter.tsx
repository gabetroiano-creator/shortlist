// Generic scatter plot (pure SVG). Plots labeled, colored points in a domain.

export interface Point {
  x: number;
  y: number;
  label: string;
  color: string;
}

export default function Scatter({
  points,
  xLabel,
  yLabel,
  xDomain,
  yDomain,
}: {
  points: Point[];
  xLabel: string;
  yLabel: string;
  xDomain: [number, number];
  yDomain: [number, number];
}) {
  const W = 560;
  const H = 320;
  const m = { l: 54, r: 116, t: 16, b: 44 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const sx = (x: number) => m.l + ((x - x0) / (x1 - x0)) * pw;
  const sy = (y: number) => m.t + ph - ((y - y0) / (y1 - y0)) * ph;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${yLabel} vs ${xLabel}`}>
      <rect x={m.l} y={m.t} width={pw} height={ph} fill="none" stroke="#E7E2D8" strokeWidth={1} />
      {/* midlines */}
      <line x1={sx((x0 + x1) / 2)} y1={m.t} x2={sx((x0 + x1) / 2)} y2={m.t + ph} stroke="#E7E2D8" strokeDasharray="4 4" />
      <line x1={m.l} y1={sy((y0 + y1) / 2)} x2={m.l + pw} y2={sy((y0 + y1) / 2)} stroke="#E7E2D8" strokeDasharray="4 4" />
      {/* axis titles */}
      <text x={m.l + pw / 2} y={H - 8} textAnchor="middle" fontSize={12} fill="#5C574E">
        {xLabel} →
      </text>
      <text x={16} y={m.t + ph / 2} textAnchor="middle" fontSize={12} fill="#5C574E" transform={`rotate(-90 16 ${m.t + ph / 2})`}>
        {yLabel} →
      </text>
      {/* points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={sx(p.x)} cy={sy(p.y)} r={6} fill={p.color} stroke="#FAF8F3" strokeWidth={2} />
          <text x={sx(p.x) + 10} y={sy(p.y) + 4} fontSize={12} fontWeight={500} fill="#211E1A">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
