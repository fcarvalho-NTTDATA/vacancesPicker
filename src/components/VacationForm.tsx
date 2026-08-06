"use client";

import { useActionState, useMemo, useState } from "react";
import { createVacationEntry } from "@/app/(app)/ferias/actions";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";
import { countBusinessDays, rangesOverlap, toDateOnlyUTC } from "@/lib/vacation";

type ExistingRange = { startDate: string; endDate: string };

type Preview =
  | { kind: "error"; message: string }
  | { kind: "info"; daysCount: number; remainingAfter: number };

export function VacationForm({
  existingRanges,
  remainingDays,
}: {
  existingRanges: ExistingRange[];
  remainingDays: number;
}) {
  const [state, formAction, isPending] = useActionState(
    createVacationEntry,
    undefined
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Reset the fields once a submission succeeds. Comparing against the
  // previous action state during render (instead of in an effect) avoids an
  // extra render pass — see https://react.dev/learn/you-might-not-need-an-effect
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state?.ok) {
      setStartDate("");
      setEndDate("");
    }
  }

  const preview = useMemo<Preview | null>(() => {
    if (!startDate || !endDate) return null;
    if (endDate < startDate) {
      return { kind: "error", message: "A data de fim não pode ser anterior à data de início" };
    }

    const start = toDateOnlyUTC(startDate);
    const end = toDateOnlyUTC(endDate);
    const daysCount = countBusinessDays(start, end);

    if (daysCount === 0) {
      return { kind: "error", message: "Este período não inclui dias úteis (só fins de semana)" };
    }

    const overlaps = existingRanges.some((range) =>
      rangesOverlap(start, end, toDateOnlyUTC(range.startDate), toDateOnlyUTC(range.endDate))
    );
    if (overlaps) {
      return { kind: "error", message: "Sobrepõe-se a um período já registado" };
    }

    return { kind: "info", daysCount, remainingAfter: remainingDays - daysCount };
  }, [startDate, endDate, existingRanges, remainingDays]);

  const blocked = preview?.kind === "error";

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
        <FormField label="Início" htmlFor="startDate">
          <Input
            id="startDate"
            name="startDate"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FormField>
        <FormField label="Fim" htmlFor="endDate">
          <Input
            id="endDate"
            name="endDate"
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FormField>
        <Button type="submit" disabled={isPending || blocked}>
          {isPending ? "A adicionar…" : "Adicionar período"}
        </Button>
      </div>

      {preview?.kind === "error" && (
        <p className="rounded-md bg-ntt-red-light px-3 py-2 text-sm text-ntt-red-dark">
          {preview.message}
        </p>
      )}

      {preview?.kind === "info" && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            preview.remainingAfter < 0
              ? "bg-ntt-red-light text-ntt-red-dark"
              : "bg-navy-50 text-navy"
          }`}
        >
          {preview.daysCount === 1 ? "1 dia útil" : `${preview.daysCount} dias úteis`}
          {" · "}
          {preview.remainingAfter < 0
            ? `Excede o saldo em ${Math.abs(preview.remainingAfter)} dia${Math.abs(preview.remainingAfter) > 1 ? "s" : ""}`
            : `Ficam ${preview.remainingAfter} dias restantes`}
        </p>
      )}

      {state?.message && (
        <p className="rounded-md bg-ntt-red-light px-3 py-2 text-sm text-ntt-red-dark">
          {state.message}
        </p>
      )}
    </form>
  );
}
