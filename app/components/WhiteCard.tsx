import type { ReactNode } from "react";

type WhiteCardProps = {
    className?: string;
    padding?: string;
    children?: ReactNode;
};

export default function WhiteCard({ className = "", padding = "p-3 md:p-6", children }: WhiteCardProps) {
    return(
        <div className={`bg-white w-full rounded-2xl flex justify-between items-center ${className} ${padding}`}>
            {children}
        </div>
    )
}