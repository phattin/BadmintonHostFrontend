import { ReactNode } from "react";

import WhiteCard from "@/app/components/WhiteCard";

interface ManagementListCardProps {
  children: ReactNode;
  className?: string;
}

export default function ManagementListCard({
  children,
  className = "",
}: ManagementListCardProps) {
  return (
    <WhiteCard
      className={`flex-col items-stretch p-0! ${className}`}
    >
      {children}
    </WhiteCard>
  );
}