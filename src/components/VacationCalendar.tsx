import { MONTH_NAMES_PT, WEEKDAY_LABELS_PT } from "@/lib/vacation";

type Range = { startDate: Date; endDate: Date };

function isWithinRanges(date: Date, ranges: Range[]) {
  const time = date.getTime();
  return ranges.some((r) => time >= r.startDate.getTime() && time <= r.endDate.getTime());
}

function MonthGrid({
  year,
  month,
  ranges,
}: {
  year: number;
  month: number;
  ranges: Range[];
}) {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const startOffset = (firstDay.getUTCDay() + 6) % 7; // segunda = 0

  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-md border border-gray-200 p-3">
      <p className="mb-2 text-sm font-semibold text-navy">
        {MONTH_NAMES_PT[month]}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-400">
        {WEEKDAY_LABELS_PT.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />;
          const date = new Date(Date.UTC(year, month, day));
          const weekday = date.getUTCDay();
          const isWeekend = weekday === 0 || weekday === 6;
          const onVacation = isWithinRanges(date, ranges);
          return (
            <span
              key={i}
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                onVacation
                  ? "bg-blue font-semibold text-white"
                  : isWeekend
                  ? "text-gray-300"
                  : "text-navy"
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function VacationCalendar({
  year,
  ranges,
}: {
  year: number;
  ranges: Range[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {MONTH_NAMES_PT.map((_, month) => (
        <MonthGrid key={month} year={year} month={month} ranges={ranges} />
      ))}
    </div>
  );
}
