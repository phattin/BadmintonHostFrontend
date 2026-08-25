import { ButtonHTMLAttributes, ReactNode, } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    icon?: ReactNode;
    background?: string;
    color?: string;
}

export default function Button({
  icon,
  children,
  className = "",
  background = "bg-btn_content",
  color = "text-white",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-lg
        p-4
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

      {icon && (
        <span className="flex items-center">
          {icon}
        </span>
      )}
    </button>
  );
}