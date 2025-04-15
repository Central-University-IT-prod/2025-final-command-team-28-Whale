import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const SectionHeader = ({
  title,
  subtitle,
  action,
  className = "w-full",
  titleClassName = "text-2xl font-semibold dark:text-gray-200",
  subtitleClassName = "text-sm text-muted-foreground mt-1 dark:text-gray-300"
}: SectionHeaderProps) => {
  return (
    <div className={`flex justify-between items-start ${className}`}>
      <div>
        <h2 className={titleClassName}>{title}</h2>
        {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;