import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { VacationForm } from "@/components/VacationForm";
import { VacationCalendar } from "@/components/VacationCalendar";
import { deleteVacationEntry } from "./actions";
import { formatDateISO } from "@/lib/vacation";

export default async function FeriasPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const session = await requireSession();
  const { ano } = await searchParams;
  const year = ano ? Number(ano) : new Date().getFullYear();

  const [user, entries] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      include: { projects: { include: { project: true } } },
    }),
    prisma.vacationEntry.findMany({
      where: {
        userId: session.user.id,
        startDate: { gte: new Date(Date.UTC(year, 0, 1)) },
        endDate: { lte: new Date(Date.UTC(year, 11, 31)) },
      },
      orderBy: { startDate: "asc" },
    }),
  ]);

  const usedDays = entries.reduce((sum, e) => sum + e.daysCount, 0);
  const remaining = user.annualVacationDays - usedDays;

  const years = [year - 1, year, year + 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy">As minhas férias</h1>
          <p className="text-sm text-gray-500">
            Regista os teus períodos de férias para {year}.
          </p>
        </div>
        <div className="flex gap-2">
          {years.map((y) => (
            <Link
              key={y}
              href={`/ferias?ano=${y}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                y === year
                  ? "bg-navy text-white"
                  : "bg-navy-50 text-navy hover:bg-gray-200"
              }`}
            >
              {y}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Dias anuais
            </p>
            <p className="mt-1 text-2xl font-bold text-navy">
              {user.annualVacationDays}
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Dias usados
            </p>
            <p className="mt-1 text-2xl font-bold text-navy">{usedDays}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Dias restantes
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                remaining < 0 ? "text-ntt-red" : "text-navy"
              }`}
            >
              {remaining}
            </p>
          </CardBody>
        </Card>
      </div>

      {user.projects.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Projetos:</span>
          {user.projects.map(({ project }) => (
            <Badge key={project.id} color={project.color}>
              {project.name}
            </Badge>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Adicionar período de férias</CardTitle>
        </CardHeader>
        <CardBody>
          <VacationForm />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Períodos registados em {year}</CardTitle>
        </CardHeader>
        <CardBody>
          {entries.length === 0 ? (
            <p className="text-sm text-gray-500">
              Ainda não registaste férias para este ano.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-navy">
                      {formatDateISO(entry.startDate)} — {formatDateISO(entry.endDate)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {entry.daysCount === 1
                        ? "1 dia útil"
                        : `${entry.daysCount} dias úteis`}
                    </p>
                  </div>
                  <form action={deleteVacationEntry}>
                    <input type="hidden" name="id" value={entry.id} />
                    <button
                      type="submit"
                      className="text-sm font-medium text-ntt-red hover:text-ntt-red-dark"
                    >
                      Remover
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendário {year}</CardTitle>
        </CardHeader>
        <CardBody>
          <VacationCalendar
            year={year}
            ranges={entries.map((e) => ({
              startDate: e.startDate,
              endDate: e.endDate,
            }))}
          />
        </CardBody>
      </Card>
    </div>
  );
}
