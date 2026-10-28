// =============================================================================
// dm-data.js — tabelas do Guia do Mestre 5e (bootstrap do compêndio)
// =============================================================================

// --- Tabela de Tesouro Individual (p.133-135 do Guia do Mestre) --------------
// CR → entrada { desc, rolls: [{p: % cumulativo, result: fn que gera str }] }
// p é o limite superior do intervalo (ex: 30 significa 1-30).
const DM_DATA = {
  treasureIndividual: {
    '0-4': [
      { p: 30, label: '5d6 PC' },
      { p: 60, label: '4d6 PP' },
      { p: 70, label: '3d6 PE' },
      { p: 95, label: '3d6 PO' },
      { p: 100, label: '1d6 PL' },
    ],
    '5-10': [
      { p: 30, label: '4d6 × 100 PC + 1d6 × 10 PE' },
      { p: 60, label: '6d6 × 10 PP + 2d6 × 10 PE' },
      { p: 70, label: '3d6 × 10 PE + 2d6 × 10 PO' },
      { p: 95, label: '4d6 × 10 PO' },
      { p: 100, label: '2d6 × 10 PL' },
    ],
    '11-16': [
      { p: 20, label: '4d6 × 100 PP + 1d6 × 100 PO' },
      { p: 35, label: '1d6 × 100 PE + 1d6 × 100 PO' },
      { p: 75, label: '2d6 × 100 PO + 1d6 × 10 PL' },
      { p: 100, label: '2d6 × 10 PL + 2d6 × 100 PO' },
    ],
    '17+': [
      { p: 15, label: '2d6 × 1000 PE + 8d6 × 100 PO' },
      { p: 55, label: '1d6 × 1000 PO + 1d6 × 100 PL' },
      { p: 100, label: '1d6 × 1000 PO + 2d6 × 100 PL' },
    ],
  },

  // --- Tabela de Tesouro de Covil / Hoard (p.136-139 do Guia do Mestre) ----
  // Valores aproximados: as moedas são uma quantia fixa por faixa de CR
  // (diferente do Tesouro Individual, que sorteia a faixa via d100). O d100
  // "extra" decide se o covil também tem objetos de arte, gemas, ou item(ns)
  // mágico(s) — nesse caso o mestre rola a peça exata na Tabela de Item
  // Mágico (A–I) correspondente, direto no livro.
  treasureHoard: {
    '0-4': {
      coins: '6d6×100 PC + 3d6×100 PP + 2d6×10 PO',
      extra: [
        { p: 16, kind: 'none' },
        { p: 36, kind: 'art',  count: '2d4', each: 25 },
        { p: 56, kind: 'gems', count: '2d4', each: 50 },
        { p: 76, kind: 'item', table: 'A' },
        { p: 88, kind: 'item', table: 'B' },
        { p: 95, kind: 'item', table: 'C' },
        { p: 100, kind: 'item', table: 'F' },
      ],
    },
    '5-10': {
      coins: '2d6×100 PC + 2d6×100 PP + 6d6×100 PO + 3d6×10 PL',
      extra: [
        { p: 14, kind: 'none' },
        { p: 30, kind: 'art',  count: '2d4', each: 250 },
        { p: 52, kind: 'gems', count: '3d6', each: 100 },
        { p: 68, kind: 'item', table: 'C' },
        { p: 78, kind: 'item', table: 'D' },
        { p: 88, kind: 'item', table: 'E' },
        { p: 95, kind: 'item', table: 'F' },
        { p: 100, kind: 'item', table: 'G' },
      ],
    },
    '11-16': {
      coins: '4d6×100 PP + 5d6×100 PO + 9d6×100 PL',
      extra: [
        { p: 10, kind: 'none' },
        { p: 24, kind: 'art',  count: '2d4', each: 750 },
        { p: 44, kind: 'gems', count: '3d6', each: 500 },
        { p: 58, kind: 'item', table: 'E' },
        { p: 72, kind: 'item', table: 'F' },
        { p: 84, kind: 'item', table: 'G' },
        { p: 94, kind: 'item', table: 'H' },
        { p: 100, kind: 'item', table: 'I' },
      ],
    },
    '17+': {
      coins: '7d6×100 PO + 8d6×100 PL',
      extra: [
        { p: 8, kind: 'none' },
        { p: 20, kind: 'art',  count: '3d6', each: 2500 },
        { p: 38, kind: 'gems', count: '3d6', each: 1000 },
        { p: 52, kind: 'item', table: 'G' },
        { p: 66, kind: 'item', table: 'H' },
        { p: 100, kind: 'item', table: 'I' },
      ],
    },
  },

  // --- XP budget por nível (Guia do Mestre p.82) ---------------------------
  xpThresholds: {
    1:  { easy: 25,  medium: 50,  hard: 75,   deadly: 100 },
    2:  { easy: 50,  medium: 100, hard: 150,  deadly: 200 },
    3:  { easy: 75,  medium: 150, hard: 225,  deadly: 400 },
    4:  { easy: 125, medium: 250, hard: 375,  deadly: 500 },
    5:  { easy: 250, medium: 500, hard: 750,  deadly: 1100 },
    6:  { easy: 300, medium: 600, hard: 900,  deadly: 1400 },
    7:  { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
    8:  { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
    9:  { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
    10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
    11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
    12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
    13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
    14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
    15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
    16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
    17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
    18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
    19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
    20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
  },

  // Multiplicador de encontro por número de monstros
  encounterMultiplier: [
    { n: 1, m: 1 },
    { n: 2, m: 1.5 },
    { n: 3, m: 2 }, { n: 4, m: 2 }, { n: 5, m: 2 }, { n: 6, m: 2 },
    { n: 7, m: 2.5 }, { n: 8, m: 2.5 }, { n: 9, m: 2.5 }, { n: 10, m: 2.5 },
    { n: 11, m: 3 }, { n: 12, m: 3 }, { n: 13, m: 3 }, { n: 14, m: 3 }, { n: 15, m: 3 },
    { n: 16, m: 4 },
  ],

  // XP de monstros por CR
  xpByCR: {
    '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
    '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
    '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
    '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
    '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
    '21': 33000, '22': 41000, '23': 50000, '24': 62000, '25': 75000,
    '26': 90000, '27': 105000, '28': 120000, '29': 135000, '30': 155000,
  },
};

// --- Utilitários ------------------------------------------------------------
function rollTreasureIndividual(cr) {
  const table = DM_DATA.treasureIndividual[cr];
  const roll = Math.floor(Math.random() * 100) + 1;
  const entry = table.find(e => roll <= e.p);
  return { roll, label: entry.label, resolved: resolveDiceExpr(entry.label) };
}

// Avalia expressões como "5d6 PC", "4d6 × 100 PC + 1d6 × 10 PE" → objeto { pc, pp, pe, po, pl }
function resolveDiceExpr(expr) {
  const parts = expr.split('+').map(s => s.trim());
  const totals = { pc: 0, pp: 0, pe: 0, po: 0, pl: 0 };
  const coinMap = { PC: 'pc', PP: 'pp', PE: 'pe', PO: 'po', PL: 'pl' };
  for (const p of parts) {
    const m = p.match(/^(\d+)d(\d+)(?:\s*[×*]\s*(\d+))?\s*(PC|PP|PE|PO|PL)$/i);
    if (!m) continue;
    const [_, n, d, mult, coin] = m;
    let sum = 0;
    for (let i = 0; i < +n; i++) sum += Math.floor(Math.random() * +d) + 1;
    if (mult) sum *= +mult;
    totals[coinMap[coin.toUpperCase()]] += sum;
  }
  return totals;
}

function rollDiceNotation(notation) {
  const m = notation.match(/^(\d+)d(\d+)$/i);
  if (!m) return 0;
  const [, n, d] = m;
  let sum = 0;
  for (let i = 0; i < +n; i++) sum += Math.floor(Math.random() * +d) + 1;
  return sum;
}

function rollTreasureHoard(crTier) {
  const table = DM_DATA.treasureHoard[crTier];
  const coinsResolved = resolveDiceExpr(table.coins);
  const roll = Math.floor(Math.random() * 100) + 1;
  const entry = table.extra.find(e => roll <= e.p);

  let extraLabel = 'Nenhum item adicional';
  if (entry.kind === 'art' || entry.kind === 'gems') {
    const count = rollDiceNotation(entry.count);
    const total = count * entry.each;
    const noun = entry.kind === 'art' ? 'objeto(s) de arte' : 'gema(s)';
    extraLabel = `${count} ${noun} (${entry.each} po cada) = ${total} po`;
  } else if (entry.kind === 'item') {
    extraLabel = `1 item mágico — role na Tabela de Item Mágico ${entry.table} do GdM`;
  }

  return { coinsLabel: table.coins, coinsResolved, roll, extraLabel };
}

function encounterMultiplier(nMonsters) {
  const row = DM_DATA.encounterMultiplier.find(r => r.n >= nMonsters)
            || DM_DATA.encounterMultiplier[DM_DATA.encounterMultiplier.length - 1];
  return row.m;
}

function partyThresholds(levels) {
  const sum = { easy: 0, medium: 0, hard: 0, deadly: 0 };
  for (const lvl of levels) {
    const t = DM_DATA.xpThresholds[lvl] || DM_DATA.xpThresholds[20];
    sum.easy += t.easy; sum.medium += t.medium; sum.hard += t.hard; sum.deadly += t.deadly;
  }
  return sum;
}

function evaluateEncounter(partyLevels, monsters) {
  // monsters: [{ cr: '2', count: 3 }, ...]
  const thresholds = partyThresholds(partyLevels);
  let baseXP = 0;
  let totalCount = 0;
  for (const m of monsters) {
    const xp = DM_DATA.xpByCR[m.cr] || 0;
    baseXP += xp * m.count;
    totalCount += m.count;
  }
  const mult = encounterMultiplier(totalCount);
  const adjustedXP = Math.round(baseXP * mult);
  let difficulty = 'trivial';
  if (adjustedXP >= thresholds.deadly) difficulty = 'mortal';
  else if (adjustedXP >= thresholds.hard) difficulty = 'difícil';
  else if (adjustedXP >= thresholds.medium) difficulty = 'moderado';
  else if (adjustedXP >= thresholds.easy) difficulty = 'fácil';
  return { baseXP, mult, adjustedXP, thresholds, difficulty, totalCount };
}

window.DM_DATA = DM_DATA;
window.rollTreasureIndividual = rollTreasureIndividual;
window.rollTreasureHoard = rollTreasureHoard;
window.evaluateEncounter = evaluateEncounter;
