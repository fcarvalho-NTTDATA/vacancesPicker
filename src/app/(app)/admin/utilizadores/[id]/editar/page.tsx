import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { UserForm } from "@/components/UserForm";
import { updateUser } from "../../actions";

export default async function EditarUtilizadorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [user, projects] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: { projects: true },
    }),
    prisma.project.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!user) {
    notFound();
  }

  const boundUpdate = updateUser.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-navy">Editar utilizador</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da conta</CardTitle>
        </CardHeader>
        <CardBody>
          <UserForm
            action={boundUpdate}
            projects={projects}
            submitLabel="Guardar alterações"
            initial={{
              name: user.name,
              email: user.email,
              role: user.role,
              annualVacationDays: user.annualVacationDays,
              projectIds: user.projects.map((p) => p.projectId),
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
