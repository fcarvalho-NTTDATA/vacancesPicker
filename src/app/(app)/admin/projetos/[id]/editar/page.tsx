import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProjectForm } from "@/components/ProjectForm";
import { updateProject } from "../../actions";

export default async function EditarProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    notFound();
  }

  const boundUpdate = updateProject.bind(null, id);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-navy">Editar projeto</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do projeto</CardTitle>
        </CardHeader>
        <CardBody>
          <ProjectForm
            action={boundUpdate}
            submitLabel="Guardar alterações"
            initial={{ name: project.name, color: project.color }}
          />
        </CardBody>
      </Card>
    </div>
  );
}
