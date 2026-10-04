import { useRef, useState } from 'react';
import { createLocalBackup, mapCsvRows, parseCsv, validateBackup, TRACKER_DATA_KEY } from '../utils/dataPortability';

const CSV_TYPES = [
  ['workouts', 'Workouts'],
  ['tradingJournal', 'Trades'],
  ['jobApplications', 'Job applications'],
  ['dailyScores', 'Daily scores'],
  ['expenses', 'Expenses']
];

function LocalDataTools({ userData, setUserData, addNotification }) {
  const backupInput = useRef(null);
  const csvInput = useRef(null);
  const [kind, setKind] = useState('workouts');
  const [pendingBackup, setPendingBackup] = useState(null);
  const [pendingCsv, setPendingCsv] = useState(null);
  const [error, setError] = useState('');

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(createLocalBackup(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    addNotification('Local backup downloaded to this device.', 'success');
  };

  const readBackup = async (file) => {
    setError('');
    try { setPendingBackup(validateBackup(JSON.parse(await file.text()))); }
    catch (cause) { setError(cause.message || 'Could not read that backup.'); }
  };

  const restoreBackup = () => {
    if (!pendingBackup) return;
    if (!window.confirm('Replace this browser’s tracker data with the selected backup? This only changes local data on this device.')) return;
    localStorage.setItem(TRACKER_DATA_KEY, JSON.stringify(pendingBackup.data));
    for (const [key, value] of Object.entries(pendingBackup.auxiliary || {})) localStorage.setItem(key, JSON.stringify(value));
    setUserData(pendingBackup.data);
    setPendingBackup(null);
    addNotification('Backup restored in this browser.', 'success');
  };

  const readCsv = async (file) => {
    setError('');
    try {
      const rows = parseCsv(await file.text());
      const result = mapCsvRows(kind, rows);
      if (!result.imported.length) throw new Error('No valid rows found. Check the required columns for the selected data type.');
      setPendingCsv({ ...result, kind });
    } catch (cause) { setError(cause.message || 'Could not read that CSV.'); }
  };

  const importCsv = () => {
    if (!pendingCsv) return;
    const { kind: target, imported } = pendingCsv;
    if (target === 'expenses') {
      setUserData((current) => ({ ...current, financialData: { ...current.financialData, expenses: [...(current.financialData?.expenses || []), ...imported] } }));
    } else {
      setUserData((current) => ({ ...current, [target]: [...(current[target] || []), ...imported] }));
    }
    setPendingCsv(null);
    addNotification(`Imported ${imported.length} ${target === 'tradingJournal' ? 'trades' : target}.`, 'success');
  };

  const sampleCsv = kind === 'workouts' ? 'date,type,duration,notes\n2026-10-01,Strength,45,Example' :
    kind === 'tradingJournal' ? 'date,asset,type,entry,exit,pnl,notes\n2026-10-01,SPY,Long,500,505,250,Example' :
      kind === 'jobApplications' ? 'date,company,position,status,tier\n2026-10-01,Example Co,Analyst,Applied,Tier 1' :
        kind === 'dailyScores' ? 'date,score\n2026-10-01,7.5' : 'date,amount,category,description\n2026-10-01,25,Food,Example';

  return (
    <section className="framework-card space-y-4" aria-labelledby="local-data-tools-title">
      <div>
        <h3 id="local-data-tools-title" className="text-lg font-bold text-white">Local data, backup, and imports</h3>
        <p className="mt-1 text-sm text-slate-300">Tracker data stays in this browser. These tools do not upload backups or CSV files. Save backups somewhere private; they contain your personal data.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={downloadBackup} className="btn-primary">Download full backup</button>
        <button type="button" onClick={() => backupInput.current?.click()} className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-white hover:bg-slate-700">Choose backup to restore</button>
        <input ref={backupInput} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { if (event.target.files?.[0]) readBackup(event.target.files[0]); event.target.value = ''; }} />
      </div>
      {pendingBackup && <div className="rounded-lg border border-amber-700/60 bg-amber-950/30 p-3 text-sm text-amber-100"><p>Backup from {new Date(pendingBackup.exportedAt).toLocaleString()}. Review the replacement before restoring.</p><button type="button" onClick={restoreBackup} className="mt-2 rounded bg-amber-700 px-3 py-2 font-semibold text-white">Replace local data from backup</button><button type="button" onClick={() => setPendingBackup(null)} className="ml-2 rounded border border-slate-600 px-3 py-2 text-white">Cancel</button></div>}

      <div className="border-t border-slate-700 pt-4">
        <h4 className="font-semibold text-white">Import tracker CSV</h4>
        <p className="mt-1 text-xs text-slate-400">Append rows from files exported by your own services. Nothing is sent to a bank, broker, employer, or cloud service.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-sm text-slate-300">CSV contains
            <select value={kind} onChange={(event) => { setKind(event.target.value); setPendingCsv(null); }} className="ml-2 rounded border border-slate-600 bg-slate-900 px-3 py-2 text-white">
              {CSV_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <button type="button" onClick={() => csvInput.current?.click()} className="rounded-lg border border-teal-700 bg-teal-950/50 px-4 py-2 text-sm text-teal-100 hover:bg-teal-900">Choose CSV</button>
          <input ref={csvInput} type="file" accept="text/csv,.csv" className="hidden" onChange={(event) => { if (event.target.files?.[0]) readCsv(event.target.files[0]); event.target.value = ''; }} />
          <a className="text-xs text-sky-300 underline" href={`data:text/csv;charset=utf-8,${encodeURIComponent(sampleCsv)}`} download={`${kind}-import-template.csv`}>Download template</a>
        </div>
        {pendingCsv && <div className="mt-3 rounded-lg border border-teal-800 bg-teal-950/30 p-3 text-sm text-teal-100"><p>Ready to append {pendingCsv.imported.length} rows. {pendingCsv.skipped.length ? `${pendingCsv.skipped.length} invalid rows skipped (row numbers: ${pendingCsv.skipped.slice(0, 12).join(', ')}).` : 'All rows are valid.'}</p><button type="button" onClick={importCsv} className="mt-2 rounded bg-teal-700 px-3 py-2 font-semibold text-white">Import rows locally</button><button type="button" onClick={() => setPendingCsv(null)} className="ml-2 rounded border border-slate-600 px-3 py-2 text-white">Cancel</button></div>}
      </div>
      {error && <p role="alert" className="rounded border border-red-700/60 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
    </section>
  );
}

export default LocalDataTools;
