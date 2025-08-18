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
  // ✅ If no path, return fallback
  if (!path) return "/default-fallback-image.png";

  // Replace all backslashes with forward slashes
  let fixed = path.replace(/\\/g, "/");

  // Ensure it starts with a slash
  if (!fixed.startsWith("/")) {
    fixed = "/" + fixed;
  }

  // Prepend API URL (remove trailing slash if present)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return `${baseUrl}${fixed}`;
}
