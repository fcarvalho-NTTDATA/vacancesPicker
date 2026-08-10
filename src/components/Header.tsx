import Link from "next/link";
import { signOut } from "@/lib/auth";

type Props = {
  name: string;
  role: "ADMIN" | "USER";
};

export function Header({ name, role }: Props) {
  const userLinks = [{ href: "/ferias", label: "As minhas férias" }];
  const adminLinks =
    role === "ADMIN"
      ? [
          { href: "/admin", label: "Visão geral" },
          { href: "/admin/utilizadores", label: "Utilizadores" },
          { href: "/admin/projetos", label: "Projetos" },
        ]
      : [];

  return (
    <header className="sticky top-0 z-20 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue" />
            Férias<span className="text-blue">.</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {userLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            {adminLinks.length > 0 && (
              <>
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/40">
                  <span className="h-4 w-px bg-white/20" aria-hidden />
                  Admin
                </span>
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-white/70 sm:inline">{name}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Sair
            </button>
          </form>
        </div>
      </div>
      <nav className="flex items-center gap-4 overflow-x-auto border-t border-white/10 px-6 py-2 md:hidden">
        {userLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-sm font-medium text-white/80 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        {adminLinks.length > 0 && (
          <>
            <span className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-white/40">
              <span className="h-4 w-px bg-white/20" aria-hidden />
              Admin
            </span>
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-white/80 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </>
        )}
      </nav>
    </header>
  );
}
