import { requireSession } from "@/lib/session";
import { Header } from "@/components/Header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <>
      <Header name={session.user.name ?? session.user.email ?? ""} role={session.user.role} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        Gestão de férias — uso interno
      </footer>
    </>
  );
}
