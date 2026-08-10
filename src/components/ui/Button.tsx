import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-dark focus-visible:outline-navy",
  secondary:
    "bg-navy-50 text-navy hover:bg-gray-200 focus-visible:outline-navy",
  ghost:
    "bg-transparent text-navy hover:bg-navy-50 focus-visible:outline-navy",
  danger:
    "bg-white text-danger border border-danger hover:bg-danger-light focus-visible:outline-danger",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
