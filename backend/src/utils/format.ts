import dayjs from "dayjs";

// Format M/D/Y for Fonepay - zero-padded format required
export function formatFonepayDate(d: Date = new Date()): string {
  const formatted = dayjs(d).format("MM/DD/YYYY");
  return formatted;
}

export function formatAmount(n: number): string {
  return n.toFixed(2);
}