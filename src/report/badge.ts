export type BadgeOptions = {
  score: number;
  label?: string;
};

export function renderBadgeSvg(options: BadgeOptions): string {
  const label = options.label ?? 'AgentFit';
  const score = clampScore(options.score);
  const message = `${score}/100`;
  const labelWidth = Math.max(66, label.length * 7 + 12);
  const messageWidth = 58;
  const width = labelWidth + messageWidth;
  const color = colorForScore(score);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${escapeXml(
    `${label}: ${message}`
  )}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
    <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1" stop-color="#000" stop-opacity=".5"/>
  </linearGradient>
  <clipPath id="r"><rect width="${width}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
    <rect width="${width}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${escapeXml(label)}</text>
    <text x="${labelWidth / 2}" y="14">${escapeXml(label)}</text>
    <text x="${labelWidth + messageWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${message}</text>
    <text x="${labelWidth + messageWidth / 2}" y="14">${message}</text>
  </g>
</svg>
`;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function colorForScore(score: number): string {
  if (score >= 90) {
    return '#2e7d32';
  }
  if (score >= 75) {
    return '#4c8fbd';
  }
  if (score >= 60) {
    return '#c79000';
  }
  return '#c62828';
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
