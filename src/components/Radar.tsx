// Radar / spider chart for the weighted decision matrix. Pure SVG, no deps.

export default function Radar({
  labels,
  values,
  max = 5,
  overlay,
}: {
  labels: string[];
  values: number[];
  max?: number;
  overlay?: number[]; // optional second series (e.g. a school's factor scores)
}) {
  const N = labels.length;
  const cx = 280;
  const cy = 210;
  const R = 150;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
  const pt = (i: number, r: number): [number, number] => [
    cx + Math.cos(ang(i)) * r,
    cy + Math.sin(ang(i)) * r,
  ];
  const ringPts = (r: number) =>
    Array.from({ length: N }, (_, i) => pt(i, (r / max) * R).join(",")).join(" ");
  const shape = values
    .map((v, i) => pt(i, (Math.max(0, Math.min(max, v)) / max) * R).join(","))
    .join(" ");

  return (
    <svg viewBox="0 0 560 420" className="w-full" role="img" aria-label="Weighted decision factors radar">
      {Array.from({ length: max }, (_, k) => (
        <polygon key={k} points={ringPts(k + 1)} fill="none" stroke="#E7E2D8" strokeWidth={1} />
      ))}
      {labels.map((_, i) => {
        const [x, y] = pt(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E7E2D8" strokeWidth={1} />;
      })}
      {overlay && (
        <polygon
          points={overlay
            .map((v, i) => pt(i, (Math.max(0, Math.min(max, v)) / max) * R).join(","))
            .join(" ")}
          fill="rgba(43,58,103,0.12)"
          stroke="#2B3A67"
          strokeWidth={2}
        />
      )}
      <polygon points={shape} fill="rgba(216,90,48,0.18)" stroke="#C0452B" strokeWidth={2} />
      {values.map((v, i) => {
        const [x, y] = pt(i, (Math.max(0, Math.min(max, v)) / max) * R);
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#C0452B" />;
      })}
      {overlay?.map((v, i) => {
        const [x, y] = pt(i, (Math.max(0, Math.min(max, v)) / max) * R);
        return <circle key={`o${i}`} cx={x} cy={y} r={3} fill="#2B3A67" />;
      })}
      {labels.map((label, i) => {
        const [lx, ly] = pt(i, R + 22);
        const c = Math.cos(ang(i));
        const anchor = Math.abs(c) < 0.3 ? "middle" : c > 0 ? "start" : "end";
        return (
          <text key={i} x={lx} y={ly + 4} textAnchor={anchor} fontSize={12} fill="#5C574E">
            {label}
          </text>
        );
      })}
    </svg>
  );
}
