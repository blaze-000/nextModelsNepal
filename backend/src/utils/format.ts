import dayjs from "dayjs";

// Format m/d/Y for Fonepay - based on official sample (single digit months/days allowed)
export function formatFonepayDate(d: Date = new Date()) {
  // Use current Nepal time in m/d/Y format (matching FonePay sample)
  const nepalTime = new Date(d.getTime() + (5.75 * 60 * 60 * 1000)); // UTC+5:45 for Nepal
  const month = nepalTime.getMonth() + 1; // No padding - single digit OK
  const day = nepalTime.getDate(); // No padding - single digit OK  
  const year = nepalTime.getFullYear();
  const formatted = `${month}/${day}/${year}`;
  console.log("Formatted date for FonePay (m/d/Y format):", formatted);
  return formatted;
}

export function formatAmount(n: number): string {
  return n.toFixed(2);
}