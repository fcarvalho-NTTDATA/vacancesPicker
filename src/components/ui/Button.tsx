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
    "bg-white text-ntt-red border border-ntt-red hover:bg-ntt-red-light focus-visible:outline-ntt-red",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
