import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { deleteProject } from "./actions";

export default async function ProjetosPage() {
  await requireAdmin();

  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-navy">Projetos</h1>
          <p className="text-sm text-gray-500">
            Usados para filtrar a visão de férias por equipa/projeto.
          </p>
        </div>
        <Link href="/admin/projetos/novo">
          <Button>Novo projeto</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{projects.length} projetos</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          {projects.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">
              Ainda não existem projetos. Cria o primeiro para poderes alocar pessoas.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3 font-medium">Projeto</th>
                  <th className="px-5 py-3 font-medium">Pessoas alocadas</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-5 py-3">
                      <Badge color={project.color}>{project.name}</Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {project._count.members}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/projetos/${project.id}/editar`}
                          className="text-sm font-medium text-navy hover:text-blue"
                        >
                          Editar
                        </Link>
                        <form action={deleteProject}>
                          <input type="hidden" name="id" value={project.id} />
                          <ConfirmSubmitButton
                            variant="danger"
                            className="px-2 py-1 text-xs"
                            confirmMessage={`Apagar o projeto ${project.name}?`}
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
          )}
        </CardBody>
      </Card>
    </div>
  );
}
