import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

type Person = {
  id: string;
  name: string;
  projects: { id: string; name: string; color: string }[];
  ranges: { startDate: Date; endDate: Date }[];
};

function isOnVacation(date: Date, ranges: Person["ranges"]) {
  const time = date.getTime();
  return ranges.some(
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
          {people.map((person) => (
            <tr key={person.id} className="border-t border-gray-100">
              <td className="sticky left-0 z-10 bg-white py-2 pr-3">
                <Link
                  href={`/admin/utilizadores/${person.id}/editar`}
                  className="font-medium text-navy hover:text-ntt-red"
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
              </td>
              {days.map((day) => {
                const date = new Date(Date.UTC(year, month, day));
                const weekday = date.getUTCDay();
                const isWeekend = weekday === 0 || weekday === 6;
                const onVacation = isOnVacation(date, person.ranges);
                return (
                  <td key={day} className="p-0.5 text-center align-middle">
                    <div
                      className={`mx-auto h-6 w-6 rounded ${
                        onVacation
                          ? "bg-ntt-red"
                          : isWeekend
                          ? "bg-gray-100"
                          : ""
                      }`}
                      title={onVacation ? "Férias" : undefined}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
