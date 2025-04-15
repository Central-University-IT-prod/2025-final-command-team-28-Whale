import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
  valueClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  icon?: ReactNode;
}

const MetricCard = ({
  title,
  value,
  subtitle,
  className = "",
  valueClassName = "text-4xl font-bold mt-2",
  titleClassName = "text-lg",
  subtitleClassName = "text-sm mt-2 opacity-70",
  icon
}: MetricCardProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className={titleClassName}>{title}</div>
        {icon && <div className="text-lg">{icon}</div>}
      </div>
      <div className={valueClassName}>{value}</div>
      {subtitle && <div className={subtitleClassName}>{subtitle}</div>}
    </Card>
  );
};

export default MetricCard;