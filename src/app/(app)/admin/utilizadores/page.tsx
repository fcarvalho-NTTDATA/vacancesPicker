import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { deleteUser } from "./actions";

export default async function UtilizadoresPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: { projects: { include: { project: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy">Utilizadores</h1>
          <p className="text-sm text-gray-500">
            Cria contas e aloca cada pessoa aos projetos em que participa.
          </p>
        </div>
        <Link href="/admin/utilizadores/novo">
          <Button>Novo utilizador</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{users.length} utilizadores</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Perfil</th>
                <th className="px-5 py-3 font-medium">Dias/ano</th>
                <th className="px-5 py-3 font-medium">Projetos</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-navy">
                    {user.name}
                  </td>
                  <td className="px-5 py-3 text-gray-600">{user.email}</td>
                  <td className="px-5 py-3">
                    <Badge
                      color={user.role === "ADMIN" ? "#070F26" : undefined}
                    >
                      {user.role === "ADMIN" ? "Administrador" : "Utilizador"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {user.annualVacationDays}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.projects.map((pa) => (
                        <Badge key={pa.project.id} color={pa.project.color}>
                          {pa.project.name}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/utilizadores/${user.id}/editar`}
                        className="text-sm font-medium text-navy hover:text-blue"
                      >
                        Editar
                      </Link>
                      <form action={deleteUser}>
                        <input type="hidden" name="id" value={user.id} />
                        <ConfirmSubmitButton
                          variant="danger"
                          className="px-2 py-1 text-xs"
                          confirmMessage={`Apagar o utilizador ${user.name}?`}
                        >
                          Apagar
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
