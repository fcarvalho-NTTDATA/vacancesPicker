import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { AdminFilterBar } from "@/components/AdminFilterBar";
import { AdminVacationGrid } from "@/components/AdminVacationGrid";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ projeto?: string; ano?: string; mes?: string }>;
}) {
  await requireAdmin();
  const { projeto, ano, mes } = await searchParams;

  const now = new Date();
  const year = ano ? Number(ano) : now.getFullYear();
  const month = mes !== undefined ? Number(mes) : now.getMonth();
  const projectId = projeto ?? "todos";

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
            startDate: { lte: new Date(Date.UTC(year, month + 1, 0)) },
            endDate: { gte: new Date(Date.UTC(year, month, 1)) },
          },
        },
      },
    }),
  ]);

  const people = users.map((u) => ({
    id: u.id,
    name: u.name,
    projects: u.projects.map((pa) => ({
      id: pa.project.id,
      name: pa.project.name,
      color: pa.project.color,
    })),
    ranges: u.vacationEntries.map((e) => ({
      startDate: e.startDate,
      endDate: e.endDate,
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
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {people.length} pessoa{people.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <AdminVacationGrid people={people} year={year} month={month} />
        </CardBody>
      </Card>
    </div>
  );
}
