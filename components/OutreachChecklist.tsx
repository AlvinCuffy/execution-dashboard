
import React, { useState, useEffect } from 'react';

interface ChecklistItem {
  id: string;
  name: string;
  target: number;
  completed: number;
  resourceUrl: string;
}

// ─── Replace '#' values below with your actual resource URLs ───────────────
const RESOURCE_URLS: Record<string, string> = {
  instagram: '#',
  kijiji:    '#',
  email:     '#',
};
// ───────────────────────────────────────────────────────────────────────────

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: 'instagram', name: 'Instagram', target: 10, completed: 0, resourceUrl: RESOURCE_URLS.instagram },
  { id: 'kijiji',    name: 'Kijiji',    target: 5,  completed: 0, resourceUrl: RESOURCE_URLS.kijiji },
  { id: 'email',     name: 'Email',     target: 20, completed: 0, resourceUrl: RESOURCE_URLS.email },
];

const STORAGE_KEY = 'outreach-checklist-v1';

interface StorageData {
  items: Array<{ id: string; completed: number; target: number }>;
  date: string;
}

function loadFromStorage(): ChecklistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ITEMS;
    const data: StorageData = JSON.parse(raw);
    const today = new Date().toDateString();
    const baseItems = data.date !== today
      ? DEFAULT_ITEMS.map(i => ({ ...i, completed: 0 }))
      : DEFAULT_ITEMS.map(def => {
          const stored = data.items.find(i => i.id === def.id);
          return stored ? { ...def, completed: stored.completed, target: stored.target } : def;
        });
    return baseItems.map(i => ({ ...i, resourceUrl: RESOURCE_URLS[i.id] ?? '#' }));
  } catch {
    return DEFAULT_ITEMS;
  }
}

function saveToStorage(items: ChecklistItem[]) {
  const data: StorageData = {
    items: items.map(({ id, completed, target }) => ({ id, completed, target })),
    date: new Date().toDateString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

const STYLES: Record<string, { border: string; bar: string; badge: string; glow: string; icon: string }> = {
  instagram: {
    border: 'border-pink-500/40',
    bar:    'bg-gradient-to-r from-pink-500 to-purple-500',
    badge:  'bg-pink-500/15 text-pink-300 border-pink-500/30',
    glow:   'ring-pink-500/20',
    icon:   '📸',
  },
  kijiji: {
    border: 'border-emerald-500/40',
    bar:    'bg-emerald-500',
    badge:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glow:   'ring-emerald-500/20',
    icon:   '🏷️',
  },
  email: {
    border: 'border-blue-500/40',
    bar:    'bg-blue-500',
    badge:  'bg-blue-500/15 text-blue-300 border-blue-500/30',
    glow:   'ring-blue-500/20',
    icon:   '✉️',
  },
};

export default function OutreachChecklist({ onBack }: { onBack: () => void }) {
  const [items, setItems] = useState<ChecklistItem[]>(loadFromStorage);
  const [editingTarget, setEditingTarget] = useState<string | null>(null);

  useEffect(() => { saveToStorage(items); }, [items]);

  const increment = (id: string) =>
    setItems(prev => prev.map(item =>
      item.id === id && item.completed < item.target
        ? { ...item, completed: item.completed + 1 } : item));

  const decrement = (id: string) =>
    setItems(prev => prev.map(item =>
      item.id === id && item.completed > 0
        ? { ...item, completed: item.completed - 1 } : item));

  const setTarget = (id: string, val: number) =>
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, target: Math.max(1, val) } : item));

  const resetDay = () =>
    setItems(prev => prev.map(item => ({ ...item, completed: 0 })));

  const totalCompleted = items.reduce((s, i) => s + i.completed, 0);
  const totalTarget    = items.reduce((s, i) => s + i.target, 0);
  const overallPct     = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-white transition-colors text-sm font-medium flex items-center gap-1"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              EXECUTION <span className="text-blue-400 font-light italic">DASHBOARD</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">{today}</p>
          </div>
        </div>
        <button
          onClick={resetDay}
          className="text-[11px] font-bold text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-3 py-1.5 rounded transition-all uppercase tracking-widest"
        >
          Reset Day
        </button>
      </header>

      <main className="flex-1 p-6 w-full max-w-5xl mx-auto">

        {/* ── Overall Progress ──────────────────────────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                Daily Outreach Progress
              </p>
              <p className="text-sm text-slate-400">
                <span className="text-white font-semibold">{totalCompleted}</span>
                {' '}/ {totalTarget} total actions
              </p>
            </div>
            <span className="text-3xl font-bold text-white tabular-nums">{overallPct}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-slate-600">
            <span>0</span>
            <span>{totalTarget}</span>
          </div>
        </div>

        {/* ── Category Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(item => {
            const s = STYLES[item.id];
            const pct = item.target > 0 ? Math.round((item.completed / item.target) * 100) : 0;
            const isDone = item.completed >= item.target;

            return (
              <div
                key={item.id}
                className={`bg-slate-900 border rounded-xl p-5 flex flex-col gap-4 transition-all duration-300 ${s.border} ${isDone ? `ring-1 ${s.glow}` : ''}`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl leading-none">{s.icon}</span>
                    <div>
                      <h2 className="font-bold text-white text-lg leading-tight">{item.name}</h2>
                      {isDone ? (
                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">
                          Complete ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600 uppercase tracking-wide">
                          Outreach
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${s.badge}`}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : s.bar}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                {/* Counter row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decrement(item.id)}
                      disabled={item.completed === 0}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed font-bold text-xl flex items-center justify-center transition-colors select-none"
                      aria-label={`Decrease ${item.name}`}
                    >
                      −
                    </button>
                    <span className="text-4xl font-bold w-12 text-center tabular-nums leading-none">
                      {item.completed}
                    </span>
                    <button
                      onClick={() => increment(item.id)}
                      disabled={item.completed >= item.target}
                      className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed font-bold text-xl flex items-center justify-center transition-colors select-none"
                      aria-label={`Increase ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Editable target */}
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="text-xs">Target:</span>
                    {editingTarget === item.id ? (
                      <input
                        type="number"
                        defaultValue={item.target}
                        min={1}
                        autoFocus
                        className="w-14 bg-slate-800 border border-slate-600 focus:border-blue-500 rounded px-2 py-0.5 text-sm text-white text-center outline-none transition-colors"
                        onBlur={e => {
                          const v = parseInt(e.target.value, 10);
                          if (!isNaN(v) && v > 0) setTarget(item.id, v);
                          setEditingTarget(null);
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter')  (e.currentTarget as HTMLInputElement).blur();
                          if (e.key === 'Escape') setEditingTarget(null);
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => setEditingTarget(item.id)}
                        className="font-semibold text-slate-200 hover:text-blue-400 underline decoration-dotted underline-offset-2 transition-colors"
                        title="Click to edit target"
                      >
                        {item.target}
                      </button>
                    )}
                  </div>
                </div>

                {/* Resource button */}
                <a
                  href={item.resourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full text-center text-[11px] font-bold py-2.5 rounded-lg border transition-all uppercase tracking-widest ${s.badge} hover:brightness-110`}
                >
                  Open Resource →
                </a>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
