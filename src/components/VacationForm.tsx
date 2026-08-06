"use client";

import { useActionState } from "react";
import { createVacationEntry } from "@/app/(app)/ferias/actions";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";

export function VacationForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    createVacationEntry,
    undefined
  );

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-3 sm:items-end">
      <FormField label="Início" htmlFor="startDate">
        <Input id="startDate" name="startDate" type="date" required />
      </FormField>
      <FormField label="Fim" htmlFor="endDate">
        <Input id="endDate" name="endDate" type="date" required />
      </FormField>
      <Button type="submit" disabled={isPending}>
        {isPending ? "A adicionar…" : "Adicionar período"}
      </Button>
      {errorMessage && (
        <p className="sm:col-span-3 rounded-md bg-ntt-red-light px-3 py-2 text-sm text-ntt-red-dark">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
