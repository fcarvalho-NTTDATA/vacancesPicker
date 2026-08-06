"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const baseSchema = {
  name: z.string().min(1, "Indica o nome"),
  email: z.string().email("Email inválido"),
  role: z.enum(["ADMIN", "USER"]),
  annualVacationDays: z.coerce.number().int().min(0).max(60),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(6, "A password deve ter pelo menos 6 caracteres"),
});

const updateSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .min(6, "A password deve ter pelo menos 6 caracteres")
    .optional()
    .or(z.literal("")),
});

function getProjectIds(formData: FormData) {
  return formData.getAll("projectIds").filter((v): v is string => typeof v === "string");
}

export async function createUser(
  _prevState: string | undefined,
  formData: FormData
) {
  await requireAdmin();

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    annualVacationDays: formData.get("annualVacationDays"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos";
  }

  const projectIds = getProjectIds(formData);
  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return "Já existe um utilizador com este email";
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      role: parsed.data.role,
      annualVacationDays: parsed.data.annualVacationDays,
      passwordHash,
      projects: {
        create: projectIds.map((projectId) => ({ projectId })),
      },
    },
  });

  revalidatePath("/admin/utilizadores");
  redirect("/admin/utilizadores");
}

export async function updateUser(
  id: string,
  _prevState: string | undefined,
  formData: FormData
) {
  await requireAdmin();

  const parsed = updateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    annualVacationDays: formData.get("annualVacationDays"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos";
  }

  const projectIds = getProjectIds(formData);
  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== id) {
    return "Já existe um utilizador com este email";
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email,
        role: parsed.data.role,
        annualVacationDays: parsed.data.annualVacationDays,
        ...(parsed.data.password
          ? { passwordHash: await bcrypt.hash(parsed.data.password, 10) }
          : {}),
      },
    }),
    prisma.projectAssignment.deleteMany({ where: { userId: id } }),
    prisma.projectAssignment.createMany({
      data: projectIds.map((projectId) => ({ userId: id, projectId })),
    }),
  ]);

  revalidatePath("/admin/utilizadores");
  redirect("/admin/utilizadores");
}

export async function deleteUser(formData: FormData) {
  const session = await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  if (id === session.user.id) {
    return;
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/utilizadores");
}
