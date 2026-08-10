"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import { FormField, Input } from "@/components/ui/Field";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormField label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </FormField>
      <FormField label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </FormField>

      {errorMessage && (
        <p className="rounded-md bg-danger-light px-3 py-2 text-sm text-danger-dark">
          {errorMessage}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "A entrar…" : "Entrar"}
      </Button>
    </form>
  );
}
