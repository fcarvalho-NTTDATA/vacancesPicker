"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Field";
import { MONTH_NAMES_PT } from "@/lib/vacation";

type Project = { id: string; name: string };
type View = "mes" | "ano";

export function AdminFilterBar({
  projects,
  projectId,
  year,
  month,
  view,
}: {
  projects: Project[];
  projectId: string;
  year: number;
  month: number;
  view: View;
}) {
  const router = useRouter();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams({
      projeto: projectId,
      ano: String(year),
      mes: String(month),
      vista: view,
    });
    params.set(key, value);
    router.push(`/admin?${params.toString()}`);
  }

  const years = [year - 1, year, year + 1];

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-navy">
          Vista
        </label>
        <div className="flex rounded-md border border-gray-300 p-0.5">
          <button
            type="button"
            onClick={() => updateParam("vista", "mes")}
            className={`cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "mes" ? "bg-navy text-white" : "text-navy hover:bg-navy-50"
            }`}
          >
            Mês
          </button>
          <button
            type="button"
            onClick={() => updateParam("vista", "ano")}
            className={`cursor-pointer rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "ano" ? "bg-navy text-white" : "text-navy hover:bg-navy-50"
            }`}
          >
            Ano
          </button>
        </div>
      </div>
      <div className="w-48">
        <label className="mb-1.5 block text-sm font-medium text-navy">
          Projeto
        </label>
        <Select
          value={projectId}
          onChange={(e) => updateParam("projeto", e.target.value)}
        >
          <option value="todos">Todos os projetos</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
      </div>
      {view === "mes" && (
        <div className="w-40">
          <label className="mb-1.5 block text-sm font-medium text-navy">
            Mês
          </label>
          <Select
            value={String(month)}
            onChange={(e) => updateParam("mes", e.target.value)}
          >
            {MONTH_NAMES_PT.map((name, i) => (
              <option key={i} value={i}>
                {name}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div className="w-28">
        <label className="mb-1.5 block text-sm font-medium text-navy">
          Ano
        </label>
        <Select
          value={String(year)}
          onChange={(e) => updateParam("ano", e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
