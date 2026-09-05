import { ReactNode, SelectHTMLAttributes } from "react";

import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function Select({
  label,
  id,
  icon,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="mt-5 flex w-full flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-foreground"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-foreground/60">
            {icon}
          </div>
        )}

        <select
          id={id}
          {...props}
          className={`
            w-full
            cursor-pointer
            appearance-none
            rounded-lg
            border
            border-foreground/30
            bg-surface
            py-3.5
            text-sm
            text-foreground
            outline-none
            transition
            focus:border-primary
            focus:ring-2
            focus:ring-primary/30
            ${icon ? "pl-10" : "pl-3"}
            pr-10
            ${className}
          `}
        >
          {children}
        </select>

        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-foreground/60">
          <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
}