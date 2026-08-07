"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1, "Indica o nome do projeto"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida")
    .default("#0072BC"),
});

export async function createProject(
  _prevState: string | undefined,
  formData: FormData
) {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos";
  }

  const existing = await prisma.project.findUnique({
    where: { name: parsed.data.name },
  });
  if (existing) {
    return "Já existe um projeto com este nome";
  }

  await prisma.project.create({ data: parsed.data });

  revalidatePath("/admin/projetos");
  redirect("/admin/projetos");
}

export async function updateProject(
  id: string,
  _prevState: string | undefined,
  formData: FormData
) {
  await requireAdmin();

  const parsed = schema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Dados inválidos";
  }

  const existing = await prisma.project.findUnique({
    where: { name: parsed.data.name },
  });
  if (existing && existing.id !== id) {
    return "Já existe um projeto com este nome";
  }

  await prisma.project.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/projetos");
  redirect("/admin/projetos");
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projetos");
}
