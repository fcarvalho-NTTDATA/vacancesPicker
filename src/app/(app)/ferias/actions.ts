"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { countBusinessDays, toDateOnlyUTC } from "@/lib/vacation";

export type VacationFormState = {
  ok: boolean;
  message?: string;
};

const entrySchema = z
  .object({
    startDate: z.string().min(1, "Indica a data de início"),
    endDate: z.string().min(1, "Indica a data de fim"),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "A data de fim não pode ser anterior à data de início",
    path: ["endDate"],
  });

export async function createVacationEntry(
  _prevState: VacationFormState | undefined,
  formData: FormData
): Promise<VacationFormState> {
  const session = await requireSession();

  const parsed = entrySchema.safeParse({
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const startDate = toDateOnlyUTC(parsed.data.startDate);
  const endDate = toDateOnlyUTC(parsed.data.endDate);
  const daysCount = countBusinessDays(startDate, endDate);

  if (daysCount === 0) {
    return { ok: false, message: "O período selecionado não inclui dias úteis" };
  }

  const overlapping = await prisma.vacationEntry.findFirst({
    where: {
      userId: session.user.id,
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    },
  });

  if (overlapping) {
    return { ok: false, message: "Este período sobrepõe-se a férias já registadas" };
  }

  await prisma.vacationEntry.create({
    data: {
      userId: session.user.id,
      startDate,
      endDate,
      daysCount,
    },
  });

  revalidatePath("/ferias");
  return { ok: true };
}

export async function deleteVacationEntry(formData: FormData) {
  const session = await requireSession();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await prisma.vacationEntry.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/ferias");
}
