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
  iconBgColor = "bg-tag",
  valueColor = "text-foreground",
  descriptionColor = "text-btn",
  borderColor = "border-transparent",
}: StatCardProps) {
  return (
    <WhiteCard className={`flex lg:flex-col justify-start lg:justify-between items-center lg:items-start gap-3 border ${borderColor}`}>
        <div className={`size-15 rounded-full flex items-center justify-center ${iconBgColor}`}>
            {icon}
        </div>
        <div className="flex flex-col md:gap-3">
          <p className="text-l md:text-l">
              {title}
          </p>
          <h3 className={`text-2xl md:text-3xl font-bold ${valueColor}`}>
              {value}
          </h3>
          <p className={`text-sm md:text-s font-semibold ${descriptionColor}`}>
              {description}
          </p>
        </div>
    </WhiteCard>
  )
}
