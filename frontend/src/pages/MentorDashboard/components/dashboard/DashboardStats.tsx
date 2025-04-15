import { Badge } from "@/components/ui/badge";
import { CheckCheck, Clock, CheckCircle, XOctagon } from "lucide-react";

interface DashboardStatsProps {
  activeCount: number;
  pendingCount: number;
  completedCount: number;
  rejectedCount: number;
}

export const DashboardStats = ({
  activeCount,
  pendingCount,
  completedCount,
  rejectedCount
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-card rounded-lg border border-border/50 shadow-sm">
      {/* Активные вопросы */}
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20 py-1.5 px-2 sm:px-3 w-full flex items-center justify-between text-xs sm:text-sm"
        >
          <div className="flex items-center">
            <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
            <span>Активные</span>
          </div>
          <span className="font-bold ml-1">{activeCount}</span>
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="py-1.5 px-2 sm:px-3 w-full flex items-center justify-between text-xs sm:text-sm"
        >
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>Ожидают</span>
          </div>
          <span className="font-bold ml-1">{pendingCount}</span>
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="bg-green-100 text-green-600 border-green-200 py-1.5 px-2 sm:px-3 w-full flex items-center justify-between text-xs sm:text-sm"
        >
          <div className="flex items-center">
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            <span>Завершено</span>
          </div>
          <span className="font-bold ml-1">{completedCount}</span>
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 py-1.5 px-2 sm:px-3 w-full flex items-center justify-between text-xs sm:text-sm"
        >
          <div className="flex items-center">
            <XOctagon className="h-3.5 w-3.5 mr-1.5" />
            <span>Отклонено</span>
          </div>
          <span className="font-bold ml-1">{rejectedCount}</span>
        </Badge>
      </div>
    </div>
  );
};