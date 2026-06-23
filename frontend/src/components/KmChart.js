export default function KmChart({ history }) {
  const data = history
    .filter(h => h.mileage)
    .map(h => ({ date: h.eventDate, mileage: h.mileage, desc: h.description, type: h.eventType }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (data.length < 2) {
    return (
      <div className="chart-empty">
        <span className="chart-empty-icon">📊</span>
        <p>Registre KM em pelo menos 2 eventos para ver o gráfico de evolução.</p>
      </div>
    );
  }

  const W = 560, H = 190;
  const PAD = { t: 16, r: 24, b: 38, l: 58 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const timestamps = data.map(d => new Date(d.date).getTime());
  const minT = Math.min(...timestamps);
  const maxT = Math.max(...timestamps);
  const rawMax = Math.max(...data.map(d => d.mileage));
  const niceMax = Math.ceil(rawMax / 10000) * 10000 || 10000;

  const xOf = ts => maxT === minT ? cW / 2 : ((ts - minT) / (maxT - minT)) * cW;
  const yOf = km => cH - (km / niceMax) * cH;

  const pts = data.map(d => ({
    ...d,
    x: PAD.l + xOf(new Date(d.date).getTime()),
    y: PAD.t + yOf(d.mileage),
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(PAD.t + cH).toFixed(1)} L${pts[0].x.toFixed(1)},${(PAD.t + cH).toFixed(1)} Z`;

  const TICK_COUNT = 4;
  const yTicks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => {
    const km = (niceMax / TICK_COUNT) * i;
    return { km, y: PAD.t + yOf(km) };
  });

  const fmtKm = km => km >= 1000 ? `${(km / 1000).toFixed(0)}k` : String(km);
  const fmtDate = d => {
    const [y, m] = d.split('-');
    return `${m}/${y}`;
  };

  // X-axis: show label for each data point, but skip if too close to previous
  const xLabels = [];
  pts.forEach((p, i) => {
    if (i === 0 || p.x - xLabels[xLabels.length - 1].x > 48) {
      xLabels.push({ x: p.x, label: fmtDate(p.date) });
    }
  });

  return (
    <div className="km-chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="km-chart-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="kmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4a4a8a" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#4a4a8a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid + labels */}
        {yTicks.map(({ km, y }) => (
          <g key={km}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
              stroke="#e2e8f0" strokeWidth="1" />
            <text x={PAD.l - 7} y={y + 4}
              textAnchor="end" fontSize="10" fill="#718096">
              {fmtKm(km)}
            </text>
          </g>
        ))}

        {/* Bottom axis */}
        <line x1={PAD.l} y1={PAD.t + cH} x2={W - PAD.r} y2={PAD.t + cH}
          stroke="#cbd5e0" strokeWidth="1" />

        {/* Area */}
        <path d={areaPath} fill="url(#kmGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#4a4a8a"
          strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Data points */}
        {pts.map((p, i) => (
          <g key={i}>
            <title>{p.date} — {Number(p.mileage).toLocaleString('pt-BR')} km{p.desc ? `\n${p.desc}` : ''}</title>
            <circle cx={p.x} cy={p.y} r="5"
              fill="white" stroke="#4a4a8a" strokeWidth="2.5" />
          </g>
        ))}

        {/* X labels */}
        {xLabels.map(({ x, label }, i) => (
          <text key={i} x={x} y={H - 6}
            textAnchor="middle" fontSize="10" fill="#718096">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
