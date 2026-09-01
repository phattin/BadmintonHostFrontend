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
        className="text-[14px] font-semibold text-text"
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
          border-placeholder
          bg-white
          px-3
          py-3.5
          text-sm
          text-text
          outline-none
          placeholder:text-placeholder
          focus:border-button
          focus:ring-2
          focus:ring-button/20
          ${className}
        `}
      />
    </div>
  );
}