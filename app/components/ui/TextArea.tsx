import { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default function Textarea({
  label,
  id,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="mt-5 flex w-full flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-foreground"
      >
        {label}
      </label>

      <textarea
        id={id}
        {...props}
        className={`
          min-h-28
          w-full
          resize-none
          rounded-lg
          border
          border-foreground/30
          bg-surface
          px-3
          py-3.5
          text-sm
          text-foreground
          outline-none
          transition
          placeholder:text-foreground/30
          focus:border-primary
          focus:ring-2
          focus:ring-primary/30
          ${className}
        `}
      />
    </div>
  );
}