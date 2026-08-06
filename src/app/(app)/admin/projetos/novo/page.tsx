import { requireAdmin } from "@/lib/session";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProjectForm } from "@/components/ProjectForm";
import { createProject } from "../actions";

export default async function NovoProjetoPage() {
  await requireAdmin();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-navy">Novo projeto</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do projeto</CardTitle>
        </CardHeader>
        <CardBody>
          <ProjectForm action={createProject} submitLabel="Criar projeto" />
        </CardBody>
      </Card>
    </div>
  );
}
