import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { VacationForm } from "@/components/VacationForm";
import { VacationCalendar } from "@/components/VacationCalendar";
import { deleteVacationEntry } from "./actions";
import {
  ABSENCE_TYPE_COLORS,
  ABSENCE_TYPE_LABELS_PT,
  AbsenceType,
  countsTowardVacationBalance,
  formatDateDisplay,
  formatDateISO,
} from "@/lib/vacation";

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

  const usedDays = entries
    .filter((e) => countsTowardVacationBalance(e.type as AbsenceType))
    .reduce((sum, e) => sum + e.daysCount, 0);
  const remaining = user.annualVacationDays - usedDays;

  const years = [year - 1, year, year + 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy">As minhas férias e ausências</h1>
          <p className="text-sm text-gray-500">
            Regista os teus períodos de férias, doença e compensação para {year}.
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

      <Card>
        <CardBody>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Dias anuais
              </p>
              <p className="mt-1 text-2xl font-bold text-navy">
                {user.annualVacationDays}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Dias usados
              </p>
              <p className="mt-1 text-2xl font-bold text-navy">{usedDays}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Dias restantes
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  remaining < 0 ? "text-danger" : "text-navy"
                }`}
              >
                {remaining}
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-navy-50">
            <div
              className={`h-full rounded-full ${
                remaining < 0 ? "bg-danger" : "bg-navy"
              }`}
              style={{
                width: `${Math.min(100, (usedDays / Math.max(user.annualVacationDays, 1)) * 100)}%`,
              }}
            />
          </div>
        </CardBody>
      </Card>

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
          <CardTitle>Adicionar período de ausência</CardTitle>
        </CardHeader>
        <CardBody>
          <VacationForm
            existingRanges={entries.map((e) => ({
              startDate: formatDateISO(e.startDate),
              endDate: formatDateISO(e.endDate),
            }))}
            remainingDays={remaining}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Períodos registados em {year}</CardTitle>
        </CardHeader>
        <CardBody>
          {entries.length === 0 ? (
            <p className="text-sm text-gray-500">
              Ainda não registaste ausências para este ano.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-navy">
                        {formatDateDisplay(entry.startDate)} — {formatDateDisplay(entry.endDate)}
                      </p>
                      <Badge color={ABSENCE_TYPE_COLORS[entry.type as AbsenceType]}>
                        {ABSENCE_TYPE_LABELS_PT[entry.type as AbsenceType]}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {entry.daysCount === 1
                        ? "1 dia útil"
                        : `${entry.daysCount} dias úteis`}
                      {!countsTowardVacationBalance(entry.type as AbsenceType) &&
                        " · não conta para o saldo de férias"}
                    </p>
                  </div>
                  <form action={deleteVacationEntry}>
                    <input type="hidden" name="id" value={entry.id} />
                    <ConfirmSubmitButton
                      variant="danger"
                      className="px-2 py-1 text-xs"
                      confirmMessage={`Remover o período de ${formatDateDisplay(entry.startDate)} a ${formatDateDisplay(entry.endDate)}?`}
                    >
                      Remover
                    </ConfirmSubmitButton>
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
              type: e.type as AbsenceType,
            }))}
          />
        </CardBody>
      </Card>
    </div>
  );
}
