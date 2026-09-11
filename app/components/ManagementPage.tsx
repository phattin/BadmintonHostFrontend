import { ReactNode } from "react";

import WhiteCard from "@/app/components/WhiteCard";

interface ManagementPageProps {
  title: string;
  description: string;

  action?: ReactNode;
  toolbar?: ReactNode;

  children: ReactNode;
}

export default function ManagementPage({
  title,
  description,
  action,
  toolbar,
  children,
}: ManagementPageProps) {
  return (
    <div className="flex min-h-full w-full flex-col gap-5 bg-bg p-5 pb-24 md:gap-8 md:p-8 md:pb-26 lg:pb-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1>{title}</h1>

          <p className="mt-1 text-sm text-foreground/60 md:text-base">
            {description}
          </p>
        </div>

        {action}
      </div>

      {/* SEARCH / FILTER */}
      {toolbar && (
        <WhiteCard className="items-stretch whitespace-nowrap p-0!">
          {toolbar}
        </WhiteCard>
      )}

      {children}
    </div>
  );
}