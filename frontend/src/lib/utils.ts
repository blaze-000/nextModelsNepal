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

// Date formatting function
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${day} ${month}, ${year}`;
}

// Normalized image path with fallback
export function normalizeImagePath(path?: string): string {
  if (!path) return "/default-fallback-image.png";

  const sanitized = path.replace(/\\/g, "/");

  // Leave absolute URLs untouched (backend returns full URL sometimes)
  if (sanitized.startsWith("http://") || sanitized.startsWith("https://")) {
    return sanitized;
  }

  const normalizedPath = sanitized.startsWith("/") ? sanitized : `/${sanitized}`;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

  return `${baseUrl}${normalizedPath}`;
}
