import { InputHTMLAttributes, ReactNode, } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label: string;
    icon?: ReactNode;
    rightIcon?: ReactNode;
}

export default function Input({label, id, icon, rightIcon, className="", ...props}: InputProps){
    return(
        <div className="mt-5 flex w-full flex-col gap-1">
            <label className="text-sb text-sm font-semibold" htmlFor={id}>{label}</label> 
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {icon}
                    </div>
                )}
                <input
                id={id}
                {...props}
                className={`
                    w-full
                    rounded-lg
                    border
                    border-foreground/30
                    bg-surface
                    py-3.5
                    text-sm
                    outline-none
                    placeholder:text-foreground/30
                    focus:border-primary
                    focus:ring-2
                    focus:ring-primary/30
                    ${icon ? "pl-10" : "pl-3"}
                    ${rightIcon ? "pr-10" : "pr-3"}
                    ${className}
                `}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightIcon}
                    </div>
                )}
            </div>
        </div>
    )
}