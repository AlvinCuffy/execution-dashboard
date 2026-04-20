import { useState, useEffect } from 'react';
import type { StoredData, DayRecord } from './types';
import { CATEGORIES } from './config';
import { loadData, saveData, todayKey, getToday } from './storage';
import CategoryCard from './components/CategoryCard';
import WeeklySummary from './components/WeeklySummary';

export default function App() {
  const [data, setData] = useState<StoredData>(loadData);

  useEffect(() => { saveData(data); }, [data]);

  const today: DayRecord = getToday(data);

  const updateCompleted = (id: string, delta: number) => {
    const target = data.targets[id] ?? 0;
    const current = today[id as keyof DayRecord] ?? 0;
    const next = Math.max(0, Math.min(target, current + delta));
    setData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        [todayKey()]: { ...getToday(prev), [id]: next },
      },
    }));
  };

  const updateTarget = (id: string, val: number) => {
    setData(prev => ({ ...prev, targets: { ...prev.targets, [id]: val } }));
  };

  const resetDay = () => {
    setData(prev => ({
      ...prev,
      history: { ...prev.history, [todayKey()]: { instagram: 0, kijiji: 0, email: 0 } },
    }));
  };

  const totalCompleted = CATEGORIES.reduce((s, c) => s + (today[c.id as keyof DayRecord] ?? 0), 0);
  const totalTarget    = CATEGORIES.reduce((s, c) => s + (data.targets[c.id] ?? c.defaultTarget), 0);
  const overallPct     = totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0;

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Execution <span className="text-blue-400 font-light italic">Dashboard</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">{dateLabel}</p>
          </div>
          <button onClick={resetDay}
            className="text-[11px] font-bold text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-all uppercase tracking-widest mt-1"
          >Reset Day</button>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Today's Progress</p>
              <p className="text-sm text-slate-400">
                <span className="text-white font-semibold">{totalCompleted}</span> / {totalTarget} actions
              </p>
            </div>
            <span className="text-4xl font-bold text-white tabular-nums">{overallPct}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
              style={{ width: `${overallPct}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} category={cat}
              completed={today[cat.id as keyof DayRecord] ?? 0}
              target={data.targets[cat.id] ?? cat.defaultTarget}
              onIncrement={() => updateCompleted(cat.id, 1)}
              onDecrement={() => updateCompleted(cat.id, -1)}
              onTargetChange={val => updateTarget(cat.id, val)}
            />
          ))}
        </div>

        <WeeklySummary data={data} />
      </div>
    </div>
  );
}
