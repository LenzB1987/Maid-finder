import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges Tailwind CSS classes
 * and handles conflicting classes properly.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}