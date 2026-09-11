import { ReactNode } from "react";

interface EmptyListStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export default function EmptyListState({
  icon,
  title,
  description,
  className = "",
}: EmptyListStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-5 py-16 ${className}`}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-bg text-text">
        {icon}
      </div>

      <p className="mt-3 font-semibold text-gray-700">
        {title}
      </p>

      <p className="mt-1 text-center text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}