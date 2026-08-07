import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2 text-2xl font-bold text-navy">
          <span className="inline-block h-3 w-3 rounded-full bg-blue" />
          Férias<span className="text-blue">.</span>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-navy">
            Iniciar sessão
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Acede com as credenciais fornecidas pelo administrador.
          </p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
