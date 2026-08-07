"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select } from "@/components/ui/Field";

type Project = { id: string; name: string; color: string };

type Initial = {
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  annualVacationDays: number;
  projectIds: string[];
};

export function UserForm({
  action,
  projects,
  initial,
  submitLabel,
}: {
  action: (
    prevState: string | undefined,
    formData: FormData
  ) => Promise<string | undefined>;
  projects: Project[];
  initial?: Initial;
  submitLabel: string;
}) {
  const [errorMessage, formAction, isPending] = useActionState(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nome" htmlFor="name">
          <Input id="name" name="name" required defaultValue={initial?.name} />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={initial?.email}
          />
        </FormField>
        <FormField
          label={initial ? "Nova password" : "Password"}
          htmlFor="password"
          hint={initial ? "Deixa em branco para manter a atual" : undefined}
        >
          <Input
            id="password"
            name="password"
            type="password"
            required={!initial}
          />
        </FormField>
        <FormField label="Perfil" htmlFor="role">
          <Select id="role" name="role" defaultValue={initial?.role ?? "USER"}>
            <option value="USER">Utilizador</option>
            <option value="ADMIN">Administrador</option>
          </Select>
        </FormField>
        <FormField label="Dias de férias por ano" htmlFor="annualVacationDays">
          <Input
            id="annualVacationDays"
            name="annualVacationDays"
            type="number"
            min={0}
            max={60}
            required
            defaultValue={initial?.annualVacationDays ?? 22}
          />
        </FormField>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-navy">
          Projetos alocados
        </span>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-500">
            Ainda não existem projetos criados.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {projects.map((project) => (
              <label
                key={project.id}
                className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm"
              >
                <input
                  type="checkbox"
                  name="projectIds"
                  value={project.id}
                  defaultChecked={initial?.projectIds.includes(project.id)}
                  className="accent-navy"
                />
                {project.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="rounded-md bg-ntt-red-light px-3 py-2 text-sm text-ntt-red-dark">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "A guardar…" : submitLabel}
      </Button>
    </form>
  );
}
