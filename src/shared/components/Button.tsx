import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
}

export function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  }[variant];

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm rounded",
    medium: "px-4 py-2 text-sm rounded-md",
    large: "px-6 py-3 text-base rounded-lg",
  }[size];

  const disabledClasses = props.disabled ? "opacity-50 cursor-not-allowed" : "";

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
