import type { ReactNode } from "react";
import WhiteCard from "@/app/components/WhiteCard";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;

  iconBgColor?: string;
  iconColor?: string;

  valueColor?: string;
  descriptionColor?: string;

  borderColor?: string;
};

export default function StatCard({
  title,
  value,
  description,
  icon,
  iconBgColor = "bg-placeholder",
  valueColor = "text-gray-900",
  descriptionColor = "text-text",
  borderColor = "border-transparent",
}: StatCardProps) {
  return (
    <WhiteCard className={`flex-col items-start gap-5 border ${borderColor}`}>
        <div className={`size-20 rounded-full flex items-center justify-center ${iconBgColor}`}>
            {icon}
        </div>
        <p className="text-xl">
            {title}
        </p>
        <h3 className={`text-5xl font-bold ${valueColor}`}>
            {value}
        </h3>
        <p className={`text-s font-semibold ${descriptionColor}`}>
            {description}
        </p>
    </WhiteCard>
  )
}
