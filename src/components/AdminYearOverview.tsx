import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatDateDisplay } from "@/lib/vacation";

type Person = {
  id: string;
  name: string;
  annualVacationDays: number;
  projects: { id: string; name: string; color: string }[];
  entries: { startDate: Date; endDate: Date; daysCount: number }[];
};

export function AdminYearOverview({ people }: { people: Person[] }) {
  if (people.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        Nenhuma pessoa alocada a este projeto.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
            <th className="px-5 py-3 font-medium">Pessoa</th>
            <th className="px-5 py-3 font-medium">Saldo</th>
            <th className="px-5 py-3 font-medium">Períodos no ano</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => {
            const usedDays = person.entries.reduce((sum, e) => sum + e.daysCount, 0);
            const remaining = person.annualVacationDays - usedDays;
            const pct = Math.min(100, (usedDays / Math.max(person.annualVacationDays, 1)) * 100);

            return (
              <tr key={person.id} className="border-b border-gray-50 align-top last:border-0">
                <td className="px-5 py-3">
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
                <td className="min-w-[160px] px-5 py-3">
                  <p className="text-xs text-gray-500">
                    {usedDays}/{person.annualVacationDays} dias usados
                    {remaining < 0 && (
                      <span className="ml-1 font-semibold text-ntt-red">
                        (excede {Math.abs(remaining)})
                      </span>
                    )}
                  </p>
                  <div className="mt-1 h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-navy-50">
                    <div
                      className={`h-full rounded-full ${remaining < 0 ? "bg-ntt-red" : "bg-navy"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-gray-500">
                  {person.entries.length === 0
                    ? "—"
                    : person.entries
                        .map(
                          (e) =>
                            `${formatDateDisplay(e.startDate)} – ${formatDateDisplay(e.endDate)}`
                        )
                        .join(" · ")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
