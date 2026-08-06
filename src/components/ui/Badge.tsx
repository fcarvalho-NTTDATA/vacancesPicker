import { HTMLAttributes } from "react";

export function Badge({
  color,
  className = "",
  style,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { color?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
      style={
        color
          ? { backgroundColor: `${color}1a`, color, ...style }
          : { backgroundColor: "#f3f4f8", color: "#0a0e27", ...style }
      }
      {...props}
    />
  );
}
