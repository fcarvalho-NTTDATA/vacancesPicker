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

export function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function businessDaysWithinBounds(
  rangeStart: Date,
  rangeEnd: Date,
  boundStart: Date,
  boundEnd: Date
): number {
  const clippedStart = rangeStart > boundStart ? rangeStart : boundStart;
  const clippedEnd = rangeEnd < boundEnd ? rangeEnd : boundEnd;
  if (clippedStart > clippedEnd) return 0;
  return countBusinessDays(clippedStart, clippedEnd);
}

export const HOURS_PER_DAY = 8;

export function daysToHours(days: number): number {
  return days * HOURS_PER_DAY;
}

export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart.getTime() <= bEnd.getTime() && bStart.getTime() <= aEnd.getTime();
}

export type AbsenceType = "FERIAS" | "DOENCA" | "COMPENSADO";

export const ABSENCE_TYPE_LABELS_PT: Record<AbsenceType, string> = {
  FERIAS: "Férias",
  DOENCA: "Doença",
  COMPENSADO: "Compensação",
};

export const ABSENCE_TYPE_COLORS: Record<AbsenceType, string> = {
  FERIAS: "#0072bc",
  DOENCA: "#cd7a15",
  COMPENSADO: "#6b4fbb",
};

// Todas as ausências contam sempre como dias não trabalhados; só as férias
// consomem o saldo anual de dias de férias da pessoa.
export function countsTowardVacationBalance(type: AbsenceType): boolean {
  return type === "FERIAS";
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
