import { MONTH_NAMES_PT, WEEKDAY_LABELS_PT } from "@/lib/vacation";

type Person = {
  id: string;
  name: string;
  entries: { startDate: Date; endDate: Date }[];
};

function peopleOnDate(date: Date, people: Person[]) {
  const time = date.getTime();
  return people.filter((p) =>
    p.entries.some((e) => time >= e.startDate.getTime() && time <= e.endDate.getTime())
  );
}

function MonthGrid({
  year,
  month,
  people,
}: {
  year: number;
  month: number;
  people: Person[];
}) {
  const firstDay = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const startOffset = (firstDay.getUTCDay() + 6) % 7; // segunda = 0

  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-md border border-gray-200 p-3">
      <p className="mb-2 text-sm font-semibold text-navy">{MONTH_NAMES_PT[month]}</p>
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
          const onLeave = peopleOnDate(date, people);
          const count = onLeave.length;

          return (
            <div key={i} className="group relative flex h-7 w-7 items-center justify-center">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                  count >= 3
                    ? "bg-blue font-semibold text-white"
                    : count === 2
                    ? "bg-blue/60 font-semibold text-navy"
                    : count === 1
                    ? "bg-blue-light font-semibold text-blue-dark"
                    : isWeekend
                    ? "text-gray-300"
                    : "text-navy"
                }`}
              >
                {day}
              </span>
              {count > 0 && (
                <>
                  {count >= 3 ? (
                    <span className="absolute bottom-0.5 flex h-3 min-w-[0.75rem] items-center justify-center rounded-full bg-navy px-0.5 text-[8px] font-bold leading-none text-white">
                      {count}
                    </span>
                  ) : (
                    <span className="absolute bottom-0.5 flex gap-0.5">
                      {Array.from({ length: count }).map((_, dot) => (
                        <span key={dot} className="h-1.5 w-1.5 rounded-full bg-blue" />
                      ))}
                    </span>
                  )}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden w-max max-w-[200px] -translate-x-1/2 rounded-md bg-navy px-2.5 py-1.5 text-xs text-white shadow-lg group-hover:block">
                    <p className="font-semibold">
                      {count === 1 ? "1 pessoa de férias" : `${count} pessoas de férias`}
                    </p>
                    <p className="text-white/80">{onLeave.map((p) => p.name).join(", ")}</p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminTeamCalendar({ year, people }: { year: number; people: Person[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {MONTH_NAMES_PT.map((_, month) => (
        <MonthGrid key={month} year={year} month={month} people={people} />
      ))}
    </div>
  );
}
