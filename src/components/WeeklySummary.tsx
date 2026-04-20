import type { StoredData, DayRecord } from '../types';
import { CATEGORIES } from '../config';
import { getLast7Days } from '../storage';

interface Props { data: StoredData; }

export default function WeeklySummary({ data }: Props) {
  const days = getLast7Days();
  const todayKey = new Date().toDateString();
  const records = days.map(key => {
    const day = data.history[key] ?? { instagram: 0, kijiji: 0, email: 0 };
    return { label: new Date(key).toLocaleDateString('en-US', { weekday: 'short' }), day, isToday: key === todayKey, total: day.instagram + day.kijiji + day.email };
  });
  const max = Math.max(...records.map(r => r.total), 1);
  const weekTotals = CATEGORIES.map(cat => ({
    ...cat,
    total: days.reduce((sum, key) => { const d = data.history[key]; return sum + (d ? (d[cat.id as keyof DayRecord] ?? 0) : 0); }, 0),
  }));
  const grandTotal = weekTotals.reduce((s, c) => s + c.total, 0);

  return (
    <div className="mt-8">
      <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">7-Day Overview</h2>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-slate-500 mb-4">Daily Actions</p>
            <div className="flex items-end gap-2 h-24">
              {records.map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: '80px' }}>
                    <div className={`w-full rounded-t transition-all duration-500 ${r.isToday ? 'bg-blue-500' : 'bg-slate-700'}`}
                      style={{ height: `${Math.max((r.total / max) * 80, r.total > 0 ? 4 : 0)}px` }} />
                  </div>
                  <span className={`text-[10px] font-semibold ${r.isToday ? 'text-blue-400' : 'text-slate-600'}`}>{r.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-4">This Week</p>
            <div className="flex flex-col gap-3">
              {weekTotals.map(cat => (
                <div key={cat.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span className="text-sm text-slate-400">{cat.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${cat.color.text}`}>{cat.total}</span>
                </div>
              ))}
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">Total</span>
                <span className="text-sm font-bold text-white">{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
