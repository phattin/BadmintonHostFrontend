import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  background?: string;
  color?: string;
}

export default function Button({
  icon,
  children,
  className = "",
  background = "bg-primary",
  color = "text-surface",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        flex
        items-center
        justify-center
        gap-2
        rounded-lg
        px-6
        py-3
        text-[14px]
        font-bold
        transition
        hover:opacity-90
        active:scale-[0.99]
        cursor-pointer
        ${className}
        ${background}
        ${color}
      `}
      {...props}
    >
      {children}

      {icon && <span className="flex items-center">{icon}</span>}
    </button>
  );
}
