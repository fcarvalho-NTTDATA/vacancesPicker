import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { AdminFilterBar } from "@/components/AdminFilterBar";
import { AdminVacationGrid } from "@/components/AdminVacationGrid";
import { AdminYearOverview } from "@/components/AdminYearOverview";
import { AdminTeamCalendar } from "@/components/AdminTeamCalendar";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    projeto?: string;
    ano?: string;
    mes?: string;
    vista?: string;
  }>;
}) {
  await requireAdmin();
  const { projeto, ano, mes, vista } = await searchParams;

  const now = new Date();
  const year = ano ? Number(ano) : now.getFullYear();
  const month = mes !== undefined ? Number(mes) : now.getMonth();
  const projectId = projeto ?? "todos";
  const view = vista === "ano" ? "ano" : "mes";

  const [projects, users] = await Promise.all([
    prisma.project.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      where:
        projectId === "todos"
          ? {}
          : { projects: { some: { projectId } } },
      orderBy: { name: "asc" },
      include: {
        projects: { include: { project: true } },
        vacationEntries: {
          where: {
            startDate: { gte: new Date(Date.UTC(year, 0, 1)) },
            endDate: { lte: new Date(Date.UTC(year, 11, 31)) },
          },
          orderBy: { startDate: "asc" },
        },
      },
    }),
  ]);

  const people = users.map((u) => ({
    id: u.id,
    name: u.name,
    annualVacationDays: u.annualVacationDays,
    projects: u.projects.map((pa) => ({
      id: pa.project.id,
      name: pa.project.name,
      color: pa.project.color,
    })),
    entries: u.vacationEntries.map((e) => ({
      startDate: e.startDate,
      endDate: e.endDate,
      daysCount: e.daysCount,
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-navy">Visão geral de férias</h1>
        <p className="text-sm text-gray-500">
          Consulta as férias da equipa, com filtro por projeto.
        </p>
      </div>

      <Card>
        <CardBody>
          <AdminFilterBar
            projects={projects}
            projectId={projectId}
            year={year}
            month={month}
            view={view}
          />
        </CardBody>
      </Card>

      {view === "ano" ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {people.length} pessoa{people.length !== 1 ? "s" : ""} · saldo em {year}
              </CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <AdminYearOverview people={people} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendário da equipa {year}</CardTitle>
            </CardHeader>
            <CardBody>
              <AdminTeamCalendar year={year} people={people} />
            </CardBody>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {people.length} pessoa{people.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <AdminVacationGrid
              people={people.map((p) => ({
                id: p.id,
                name: p.name,
                projects: p.projects,
                ranges: p.entries,
              }))}
              year={year}
              month={month}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
