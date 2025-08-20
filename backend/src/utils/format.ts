import dayjs from 'dayjs';

// MM/DD/YYYY
export function formatFonepayDate(d: Date = new Date()) {
  return dayjs(d).format('MM/DD/YYYY');
}

// Ensure amount format with up to 2 decimals, dot decimal mark, no thousands
export function formatAmount(v: number) {
  return v.toFixed(2);
}
