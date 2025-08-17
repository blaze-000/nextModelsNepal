import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { type ClassValue } from "tailwind-variants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Email validation
export const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Phone validation
export const validatePhone = (phone: string): boolean =>
  /^(\+\d{1,3}[- ]?)?\d{6,15}$/.test(phone);

// Normalized image path
export function normalizeImagePath(path: string): string {
  if (!path) return '';

  // Replace all backslashes with forward slashes
  let fixed = path.replace(/\\/g, '/');

  // Ensure it starts with a slash
  if (!fixed.startsWith('/')) {
    fixed = '/' + fixed;
  }

  // Prepend API URL (remove trailing slash if present to avoid //)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  return `${baseUrl}${fixed}`;
};
