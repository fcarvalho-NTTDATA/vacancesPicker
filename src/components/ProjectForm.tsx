"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";

type Initial = { name: string; color: string };

export function ProjectForm({
  action,
  initial,
  submitLabel,
}: {
  action: (
    prevState: string | undefined,
    formData: FormData
  ) => Promise<string | undefined>;
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
        <FormField label="Nome do projeto" htmlFor="name">
          <Input id="name" name="name" required defaultValue={initial?.name} />
        </FormField>
        <FormField label="Cor" htmlFor="color">
          <input
            id="color"
            name="color"
            type="color"
            defaultValue={initial?.color ?? "#0072BC"}
            className="h-10 w-full rounded-md border border-gray-300"
          />
        </FormField>
      </div>

      {errorMessage && (
        <p className="rounded-md bg-danger-light px-3 py-2 text-sm text-danger-dark">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "A guardar…" : submitLabel}
      </Button>
    </form>
  );
}
