"use client";

import { ButtonHTMLAttributes } from "react";
import { Button } from "./Button";

export function ConfirmSubmitButton({
  confirmMessage,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmMessage: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <Button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
