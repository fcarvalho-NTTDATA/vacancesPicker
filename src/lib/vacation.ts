export function countBusinessDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  );
  const last = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
  );

  while (current <= last) {
    const day = current.getUTCDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return count;
}

export function toDateOnlyUTC(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export const MONTH_NAMES_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const WEEKDAY_LABELS_PT = ["S", "T", "Q", "Q", "S", "S", "D"];
