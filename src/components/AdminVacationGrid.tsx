import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  ABSENCE_TYPE_COLORS,
  ABSENCE_TYPE_LABELS_PT,
  AbsenceType,
  businessDaysWithinBounds,
  daysToHours,
} from "@/lib/vacation";

type Person = {
  id: string;
  name: string;
  projects: { id: string; name: string; color: string }[];
  ranges: { startDate: Date; endDate: Date; type: AbsenceType }[];
};

function rangeOnDate(date: Date, ranges: Person["ranges"]) {
  const time = date.getTime();
  return ranges.find(
    (r) => time >= r.startDate.getTime() && time <= r.endDate.getTime()
  );
}

export function AdminVacationGrid({
  people,
  year,
  month,
}: {
  people: Person[];
  year: number;
  month: number;
}) {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthStart = new Date(Date.UTC(year, month, 1));
  const monthEnd = new Date(Date.UTC(year, month, daysInMonth));

  if (people.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        Nenhuma pessoa alocada a este projeto.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 min-w-[180px] bg-white pb-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Pessoa
            </th>
            {days.map((day) => {
              const date = new Date(Date.UTC(year, month, day));
              const weekday = date.getUTCDay();
              const isWeekend = weekday === 0 || weekday === 6;
              return (
                <th
                  key={day}
                  className={`w-7 pb-2 text-center text-[11px] font-medium ${
                    isWeekend ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {day}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {people.map((person) => {
            const hoursOffThisMonth = daysToHours(
              person.ranges.reduce(
                (sum, r) =>
                  sum + businessDaysWithinBounds(r.startDate, r.endDate, monthStart, monthEnd),
                0
              )
            );

            return (
            <tr key={person.id} className="border-t border-gray-100">
              <td className="sticky left-0 z-10 bg-white py-2 pr-3">
                <Link
                  href={`/admin/utilizadores/${person.id}/editar`}
                  className="font-medium text-navy hover:text-blue"
                >
                  {person.name}
                </Link>
                <div className="mt-1 flex flex-wrap gap-1">
                  {person.projects.map((p) => (
                    <Badge key={p.id} color={p.color}>
                      {p.name}
                    </Badge>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {hoursOffThisMonth > 0 ? `${hoursOffThisMonth}h fora este mês` : "Sem férias este mês"}
                </p>
              </td>
              {days.map((day) => {
                const date = new Date(Date.UTC(year, month, day));
                const weekday = date.getUTCDay();
                const isWeekend = weekday === 0 || weekday === 6;
                const range = rangeOnDate(date, person.ranges);
                return (
                  <td key={day} className="p-0.5 text-center align-middle">
                    <div
                      className={`mx-auto h-6 w-6 rounded ${
                        !range && isWeekend ? "bg-gray-100" : ""
                      }`}
                      style={
                        range
                          ? { backgroundColor: ABSENCE_TYPE_COLORS[range.type] }
                          : undefined
                      }
                      title={range ? ABSENCE_TYPE_LABELS_PT[range.type] : undefined}
                    />
                  </td>
                );
              })}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
