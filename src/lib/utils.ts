import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreToLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Average';
  if (score >= 30) return 'Needs Work';
  return 'Critical';
}

export function scoreToColor(score: number): string {
  if (score >= 85) return 'text-emerald-500';
  if (score >= 70) return 'text-green-500';
  if (score >= 50) return 'text-amber-500';
  if (score >= 30) return 'text-orange-500';
  return 'text-red-500';
}
