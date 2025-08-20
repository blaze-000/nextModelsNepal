import dayjs from 'dayjs';

// MM/DD/YYYY
export function formatFonepayDate(d: Date = new Date()) {
  return dayjs(d).format("MM/DD/YYYY");
}

export function formatAmount(v: number) {
  return v.toFixed(2);
}
