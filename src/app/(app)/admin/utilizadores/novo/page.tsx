import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { UserForm } from "@/components/UserForm";
import { createUser } from "../actions";

export default async function NovoUtilizadorPage() {
  await requireAdmin();
  const projects = await prisma.project.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-navy">Novo utilizador</h1>
        <p className="text-sm text-gray-500">
          Cria a conta e define a password inicial. A pessoa pode entrar de imediato.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da conta</CardTitle>
        </CardHeader>
        <CardBody>
          <UserForm action={createUser} projects={projects} submitLabel="Criar utilizador" />
        </CardBody>
      </Card>
    </div>
  );
}
