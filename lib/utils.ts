import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate total years of professional experience, excluding employment gaps.
 *
 * Employment periods:
 *   - Software Development Intern: June 2024 – December 2024
 *   - Java Full Stack Developer Intern: January 2025 – present
 *
 * Gap excluded: None
 */
export function getYearsOfExperience(): number {
  const now = new Date();

  const periods: { start: Date; end: Date }[] = [
    { start: new Date(2024, 5, 1), end: new Date(2024, 11, 31) },
    { start: new Date(2025, 0, 1), end: now },
  ];

  let totalDays = 0;

  for (const period of periods) {
    const end = period.end > now ? now : period.end;
    if (end < period.start) continue;

    const diffMs = end.getTime() - period.start.getTime();
    totalDays += diffMs / (1000 * 60 * 60 * 24);
  }

  const years = totalDays / 365.25;
  return Math.round(years * 10) / 10;
}
