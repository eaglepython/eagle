export const TRACKER_DATA_KEY = 'lifeTrackerData';

const arrayKeys = ['dailyScores', 'weeklyReviews', 'goals', 'habits', 'tradingJournal', 'jobApplications', 'workouts', 'interactions'];

export function createLocalBackup() {
  const data = JSON.parse(localStorage.getItem(TRACKER_DATA_KEY) || '{}');
  const auxiliary = {};
  for (const key of ['medicalResourceReviewNotes', 'lifeTrackerOllamaSettings', 'customReminders']) {
    const value = localStorage.getItem(key);
    if (value !== null) auxiliary[key] = JSON.parse(value);
  }
  return {
    format: 'life-tracker-local-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
    auxiliary
  };
}

export function validateBackup(value) {
  if (!value || value.format !== 'life-tracker-local-backup' || value.version !== 1 || !value.data || typeof value.data !== 'object') {
    throw new Error('This file is not a supported Life Tracker backup.');
  }
  for (const key of arrayKeys) {
    if (value.data[key] !== undefined && !Array.isArray(value.data[key])) {
      throw new Error(`Backup field “${key}” must be a list.`);
    }
  }
  if (value.data.financialData !== undefined && (typeof value.data.financialData !== 'object' || value.data.financialData === null || Array.isArray(value.data.financialData))) {
    throw new Error('Backup financial data is invalid.');
  }
  return value;
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted && char === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = []; cell = '';
    } else cell += char;
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) throw new Error('CSV needs a header row and at least one data row.');
  const headers = rows.shift().map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ''])));
}

function pick(row, ...names) {
  for (const name of names) if (row[name] !== undefined && row[name] !== '') return row[name];
  return undefined;
}

function finite(value) {
  const parsed = Number(String(value ?? '').replace(/[$,%\s,]/g, ''));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapCsvRows(kind, rows) {
  const skipped = [];
  const imported = [];
  rows.forEach((row, index) => {
    const date = pick(row, 'date', 'day', 'applieddate', 'workoutdate', 'tradedate');
    if (!date || Number.isNaN(Date.parse(date))) { skipped.push(index + 2); return; }
    let item;
    if (kind === 'workouts') {
      const duration = finite(pick(row, 'duration', 'minutes', 'durationminutes'));
      if (!duration || duration <= 0) { skipped.push(index + 2); return; }
      item = { date, type: pick(row, 'type', 'workout', 'activity') || 'Other', duration: String(duration), notes: pick(row, 'notes', 'comment') || '' };
    } else if (kind === 'tradingJournal') {
      const asset = pick(row, 'asset', 'symbol', 'ticker');
      const pnl = finite(pick(row, 'pnl', 'profitloss', 'realizedpnl'));
      if (!asset || pnl === undefined) { skipped.push(index + 2); return; }
      item = { date, asset, type: pick(row, 'type', 'side') || 'Long', entry: String(finite(pick(row, 'entry', 'entryprice')) ?? ''), exit: String(finite(pick(row, 'exit', 'exitprice')) ?? ''), pnl: String(pnl), notes: pick(row, 'notes', 'comment') || '' };
    } else if (kind === 'jobApplications') {
      const company = pick(row, 'company', 'employer');
      if (!company) { skipped.push(index + 2); return; }
      item = { date, company, position: pick(row, 'position', 'role', 'title', 'jobtitle') || '', tier: pick(row, 'tier', 'priority') || 'Unassigned', status: pick(row, 'status', 'stage') || 'Applied', notes: pick(row, 'notes', 'comment') || '' };
    } else if (kind === 'dailyScores') {
      const score = finite(pick(row, 'score', 'totalscore', 'dailyscore'));
      if (score === undefined || score < 0 || score > 10) { skipped.push(index + 2); return; }
      item = { date, totalScore: score, score, scores: {} };
    } else if (kind === 'expenses') {
      const amount = finite(pick(row, 'amount', 'value', 'expense'));
      if (amount === undefined || amount < 0) { skipped.push(index + 2); return; }
      item = { date, amount, category: pick(row, 'category', 'type') || 'Other', description: pick(row, 'description', 'merchant', 'name') || '' };
    }
    if (item) imported.push({ ...item, id: `import-${Date.now()}-${index}` });
  });
  return { imported, skipped };
}
