export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  defaultTarget: number;
  resourceUrl: string;
  color: { border: string; bar: string; badge: string; glow: string; text: string; };
}
export interface DayRecord { instagram: number; kijiji: number; email: number; }
export interface StoredData { targets: Record<string, number>; history: Record<string, DayRecord>; }
