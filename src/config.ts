import type { CategoryConfig } from './types';

// Replace '#' with your actual resource URLs
export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    defaultTarget: 10,
    resourceUrl: '#',
    color: {
      border: 'border-pink-500/40',
      bar:    'bg-gradient-to-r from-pink-500 to-purple-500',
      badge:  'bg-pink-500/10 text-pink-300 border-pink-500/30',
      glow:   'ring-pink-500/20',
      text:   'text-pink-400',
    },
  },
  {
    id: 'kijiji',
    name: 'Kijiji',
    icon: '🏷️',
    defaultTarget: 5,
    resourceUrl: '#',
    color: {
      border: 'border-emerald-500/40',
      bar:    'bg-emerald-500',
      badge:  'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      glow:   'ring-emerald-500/20',
      text:   'text-emerald-400',
    },
  },
  {
    id: 'email',
    name: 'Email',
    icon: '✉️',
    defaultTarget: 20,
    resourceUrl: '#',
    color: {
      border: 'border-blue-500/40',
      bar:    'bg-blue-500',
      badge:  'bg-blue-500/10 text-blue-300 border-blue-500/30',
      glow:   'ring-blue-500/20',
      text:   'text-blue-400',
    },
  },
];

export const STORAGE_KEY = 'execution-dashboard-v1';
