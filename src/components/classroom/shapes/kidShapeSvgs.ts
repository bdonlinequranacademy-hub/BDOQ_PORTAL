/** Kid-friendly SVG illustrations — soft colors, round shapes, simple faces */

const WRAP = (body: string, w = 120, h = 130) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

function kidFace(cx: number, cy: number, r = 14) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFE8B3" stroke="#03214F" stroke-width="2.5"/>
    <circle cx="${cx - 5}" cy="${cy - 2}" r="2" fill="#03214F"/>
    <circle cx="${cx + 5}" cy="${cy - 2}" r="2" fill="#03214F"/>
    <path d="M ${cx - 6} ${cy + 6} Q ${cx} ${cy + 12} ${cx + 6} ${cy + 6}" fill="none" stroke="#03214F" stroke-width="2" stroke-linecap="round"/>
  `;
}

function stepBadge(n: number | string, x: number, y: number) {
  return `
    <circle cx="${x}" cy="${y}" r="12" fill="#C4922B" stroke="#03214F" stroke-width="1.5"/>
    <text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="Arial,sans-serif">${n}</text>
  `;
}

function prayerMat(x: number, y: number, w = 70, h = 22) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#B8E6D0" stroke="#03214F" stroke-width="2"/>
    <rect x="${x + 8}" y="${y + 5}" width="${w - 16}" height="4" rx="2" fill="#C4922B" opacity="0.6"/>
    <rect x="${x + 8}" y="${y + 13}" width="${w - 16}" height="4" rx="2" fill="#C4922B" opacity="0.4"/>
  `;
}

export const namazSvgs = {
  qiyam: WRAP(`
    ${prayerMat(25, 108)}
    ${kidFace(60, 28)}
    <line x1="60" y1="42" x2="60" y2="78" stroke="#03214F" stroke-width="4" stroke-linecap="round"/>
    <line x1="60" y1="52" x2="38" y2="68" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="60" y1="52" x2="82" y2="68" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="60" y1="78" x2="44" y2="108" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="60" y1="78" x2="76" y2="108" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    ${stepBadge(1, 18, 18)}
    <text x="60" y="126" text-anchor="middle" font-size="10" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Stand (Qiyam)</text>
  `),

  ruku: WRAP(`
    ${prayerMat(25, 108)}
    ${kidFace(78, 52)}
    <line x1="78" y1="66" x2="50" y2="78" stroke="#03214F" stroke-width="4" stroke-linecap="round"/>
    <line x1="50" y1="78" x2="38" y2="108" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="50" y1="78" x2="62" y2="108" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="78" y1="66" x2="88" y2="90" stroke="#03214F" stroke-width="3" stroke-linecap="round"/>
    <line x1="88" y1="90" x2="98" y2="100" stroke="#03214F" stroke-width="3" stroke-linecap="round"/>
    ${stepBadge(2, 18, 18)}
    <text x="60" y="126" text-anchor="middle" font-size="10" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Bow (Ruku)</text>
  `),

  sujood: WRAP(`
    ${prayerMat(25, 108)}
    ${kidFace(42, 88)}
    <ellipse cx="70" cy="95" rx="28" ry="14" fill="none" stroke="#03214F" stroke-width="3.5"/>
    <line x1="42" y1="88" x2="30" y2="100" stroke="#03214F" stroke-width="3" stroke-linecap="round"/>
    <line x1="98" y1="95" x2="108" y2="88" stroke="#03214F" stroke-width="3" stroke-linecap="round"/>
    ${stepBadge(3, 18, 18)}
    <text x="60" y="126" text-anchor="middle" font-size="10" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Prostrate (Sujood)</text>
  `),

  tashahhud: WRAP(`
    ${prayerMat(25, 108)}
    ${kidFace(60, 42)}
    <line x1="60" y1="56" x2="60" y2="78" stroke="#03214F" stroke-width="4" stroke-linecap="round"/>
    <path d="M 38 108 Q 38 88 60 82 Q 82 88 82 108" fill="none" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="60" y1="68" x2="42" y2="74" stroke="#03214F" stroke-width="3" stroke-linecap="round"/>
    <line x1="60" y1="68" x2="78" y2="74" stroke="#03214F" stroke-width="3" stroke-linecap="round"/>
    <circle cx="48" cy="76" r="4" fill="#FFE8B3" stroke="#03214F" stroke-width="1.5"/>
    <circle cx="72" cy="76" r="4" fill="#FFE8B3" stroke="#03214F" stroke-width="1.5"/>
    ${stepBadge(4, 18, 18)}
    <text x="60" y="126" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Sit (Tashahhud)</text>
  `),

  prayerMat: WRAP(`
    <rect x="15" y="35" width="90" height="60" rx="12" fill="#B8E6D0" stroke="#03214F" stroke-width="2.5"/>
    <rect x="25" y="48" width="70" height="8" rx="4" fill="#C4922B" opacity="0.55"/>
    <rect x="25" y="62" width="70" height="8" rx="4" fill="#C4922B" opacity="0.4"/>
    <rect x="25" y="76" width="70" height="8" rx="4" fill="#C4922B" opacity="0.3"/>
    <path d="M 60 20 L 68 32 L 60 28 L 52 32 Z" fill="#C4922B" stroke="#03214F" stroke-width="1.5"/>
    <text x="60" y="115" text-anchor="middle" font-size="10" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Prayer Mat</text>
  `, 120, 120),

  qibla: WRAP(`
    <circle cx="60" cy="58" r="38" fill="#FDF3E0" stroke="#C4922B" stroke-width="2.5"/>
    <path d="M 60 28 L 72 52 L 64 52 L 64 78 L 56 78 L 56 52 L 48 52 Z" fill="#03214F"/>
    <text x="60" y="108" text-anchor="middle" font-size="10" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Qibla Direction</text>
  `, 120, 120),

  steps: WRAP(`
    <rect x="8" y="12" width="104" height="96" rx="10" fill="#F8F9FF" stroke="#03214F" stroke-width="2"/>
    <text x="60" y="28" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Namaz Steps</text>
    ${[1, 2, 3, 4, 5, 6, 7]
      .map((n, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 22 + col * 24;
        const y = 42 + row * 28;
        return stepBadge(n, x, y);
      })
      .join("")}
    <text x="60" y="118" text-anchor="middle" font-size="8" fill="#03214F" font-family="Arial,sans-serif">1 Stand → 7 Salam</text>
  `, 120, 125),
};

export const wuduSvgs = {
  hands: WRAP(`
    <circle cx="38" cy="55" r="22" fill="#A8D8F0" stroke="#03214F" stroke-width="2" opacity="0.5"/>
    <circle cx="82" cy="55" r="22" fill="#A8D8F0" stroke="#03214F" stroke-width="2" opacity="0.5"/>
    <path d="M 30 70 L 30 45 Q 30 28 42 28 Q 48 28 48 38 L 48 70" fill="#FFE8B3" stroke="#03214F" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M 52 70 L 52 38 Q 52 28 58 28 Q 64 28 64 38 L 64 70" fill="#FFE8B3" stroke="#03214F" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M 68 70 L 68 42 Q 68 32 76 32 Q 82 32 82 42 L 82 70" fill="#FFE8B3" stroke="#03214F" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M 86 70 L 86 48 Q 86 40 92 40 Q 96 40 96 48 L 96 68" fill="#FFE8B3" stroke="#03214F" stroke-width="2.5" stroke-linejoin="round"/>
    ${stepBadge(1, 18, 18)}
    <text x="60" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Wash Hands</text>
  `, 120, 125),

  face: WRAP(`
    <ellipse cx="60" cy="62" rx="32" ry="36" fill="#A8D8F0" stroke="#03214F" stroke-width="2" opacity="0.45"/>
    ${kidFace(60, 58, 22)}
    <path d="M 35 40 Q 25 55 30 75" fill="none" stroke="#5BB5E8" stroke-width="3" stroke-linecap="round"/>
    <path d="M 85 40 Q 95 55 90 75" fill="none" stroke="#5BB5E8" stroke-width="3" stroke-linecap="round"/>
    ${stepBadge(2, 18, 18)}
    <text x="60" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Wash Face</text>
  `, 120, 125),

  arms: WRAP(`
    <line x1="60" y1="35" x2="60" y2="75" stroke="#03214F" stroke-width="4" stroke-linecap="round"/>
    <line x1="60" y1="45" x2="28" y2="58" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="60" y1="45" x2="92" y2="58" stroke="#03214F" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="28" cy="62" rx="14" ry="10" fill="#A8D8F0" stroke="#5BB5E8" stroke-width="2" opacity="0.6"/>
    <ellipse cx="92" cy="62" rx="14" ry="10" fill="#A8D8F0" stroke="#5BB5E8" stroke-width="2" opacity="0.6"/>
    ${kidFace(60, 28, 12)}
    ${stepBadge(3, 18, 18)}
    <text x="60" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Wash Arms</text>
  `, 120, 125),

  head: WRAP(`
    ${kidFace(60, 45, 20)}
    <path d="M 40 38 Q 60 18 80 38" fill="none" stroke="#5BB5E8" stroke-width="4" stroke-linecap="round"/>
    <path d="M 48 32 Q 60 24 72 32" fill="#A8D8F0" opacity="0.5"/>
    <line x1="60" y1="65" x2="60" y2="95" stroke="#03214F" stroke-width="3" stroke-linecap="round"/>
    ${stepBadge(4, 18, 18)}
    <text x="60" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Wipe Head</text>
  `, 120, 125),

  feet: WRAP(`
    <ellipse cx="45" cy="88" rx="18" ry="10" fill="#A8D8F0" stroke="#5BB5E8" stroke-width="2" opacity="0.55"/>
    <ellipse cx="75" cy="88" rx="18" ry="10" fill="#A8D8F0" stroke="#5BB5E8" stroke-width="2" opacity="0.55"/>
    <path d="M 38 95 L 38 78 Q 38 68 45 68 Q 52 68 52 78 L 52 95" fill="#FFE8B3" stroke="#03214F" stroke-width="2.5"/>
    <path d="M 68 95 L 68 78 Q 68 68 75 68 Q 82 68 82 78 L 82 95" fill="#FFE8B3" stroke="#03214F" stroke-width="2.5"/>
    ${stepBadge(5, 18, 18)}
    <text x="60" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Wash Feet</text>
  `, 120, 125),

  steps: WRAP(`
    <rect x="8" y="12" width="104" height="88" rx="10" fill="#E8F6FC" stroke="#03214F" stroke-width="2"/>
    <text x="60" y="28" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Wudu Steps</text>
    ${[1, 2, 3, 4, 5, 6]
      .map((n, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 28 + col * 28;
        const y = 44 + row * 28;
        return stepBadge(n, x, y);
      })
      .join("")}
    <text x="60" y="112" text-anchor="middle" font-size="8" fill="#03214F" font-family="Arial,sans-serif">Clean before Salah</text>
  `, 120, 120),

  water: WRAP(`
    <path d="M 60 25 Q 45 55 60 85 Q 75 55 60 25" fill="#A8D8F0" stroke="#5BB5E8" stroke-width="2"/>
    <path d="M 35 50 Q 30 65 35 78" fill="none" stroke="#5BB5E8" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 85 50 Q 90 65 85 78" fill="none" stroke="#5BB5E8" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="42" cy="95" r="5" fill="#5BB5E8" opacity="0.6"/>
    <circle cx="60" cy="100" r="4" fill="#5BB5E8" opacity="0.6"/>
    <circle cx="78" cy="95" r="5" fill="#5BB5E8" opacity="0.6"/>
    <text x="60" y="118" text-anchor="middle" font-size="9" font-weight="700" fill="#03214F" font-family="Arial,sans-serif">Water</text>
  `, 120, 125),
};
