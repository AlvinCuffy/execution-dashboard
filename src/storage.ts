import type { StoredData, DayRecord } from './types';
import { CATEGORIES, STORAGE_KEY } from './config';

const emptyDay = (): DayRecord => ({ instagram: 0, kijiji: 0, email: 0 });

const defaultTargets = (): Record<string, number> =>
  Object.fromEntries(CATEGORIES.map(c => [c.id, c.defaultTarget]));

export function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredData;
  } catch {}
  return { targets: defaultTargets(), history: {} };
}

export function saveData(data: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function todayKey(): string {
  return new Date().toDateString();
}

export function getToday(data: StoredData): DayRecord {
  return data.history[todayKey()] ?? emptyDay();
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toDateString();
  });
}
