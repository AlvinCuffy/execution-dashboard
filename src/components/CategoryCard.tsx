import { useState } from 'react';
import type { CategoryConfig } from '../types';
interface Props { category: CategoryConfig; completed: number; target: number; onIncrement: () => void; onDecrement: () => void; onTargetChange: (val: number) => void; }
export default function CategoryCard({ category: cat, completed, target, onIncrement, onDecrement, onTargetChange }: Props) {
  const [editingTarget, setEditingTarget] = useState(false);
  const pct = target > 0 ? Math.min(Math.round((completed / target) * 100), 100) : 0;
  const isDone = completed >= target;
  return (
    <div className={`bg-slate-900 border rounded-2xl p-6 flex flex-col gap-5 transition-all ${cat.color.border} ${isDone ? `ring-1 ${cat.color.glow}` : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3"><span className="text-3xl leading-none">{cat.icon}</span><div><h2 className="font-bold text-white text-xl leading-tight">{cat.name}</h2><span className={`text-[11px] font-bold uppercase tracking-wider ${isDone ? 'text-green-400' : 'text-slate-600'}`}>{isDone ? 'Complete ✓' : 'Outreach'}</span></div></div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cat.color.badge}`}>{pct}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : cat.color.bar}`} style={{ width: `${pct}%` }} /></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onDecrement} disabled={completed === 0} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed font-bold text-xl flex items-center justify-center transition-colors select-none">−</button>
          <span className="text-5xl font-bold w-14 text-center tabular-nums text-white leading-none">{completed}</span>
          <button onClick={onIncrement} disabled={completed >= target} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed font-bold text-xl flex items-center justify-center transition-colors select-none">+</button>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400"><span className="text-xs">Target:</span>
          {editingTarget ? (<input type="number" defaultValue={target} min={1} autoFocus className="w-14 bg-slate-800 border border-slate-600 focus:border-blue-500 rounded px-2 py-0.5 text-sm text-white text-center outline-none" onBlur={e => { const v = parseInt(e.target.value, 10); if (!isNaN(v) && v > 0) onTargetChange(v); setEditingTarget(false); }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') setEditingTarget(false); }} />) : (<button onClick={() => setEditingTarget(true)} className="font-semibold text-slate-200 hover:text-blue-400 underline decoration-dotted underline-offset-2 transition-colors" title="Click to edit">{target}</button>)}
        </div>
      </div>
      <a href={cat.resourceUrl} target="_blank" rel="noopener noreferrer" className={`block w-full text-center text-[11px] font-bold py-2.5 rounded-xl border transition-all uppercase tracking-widest ${cat.color.badge} hover:brightness-125`}>Open Resource →</a>
    </div>
  );
}
