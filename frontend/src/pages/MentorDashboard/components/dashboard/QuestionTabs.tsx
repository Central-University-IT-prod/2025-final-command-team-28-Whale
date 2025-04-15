import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Clock, CheckCircle, XOctagon } from "lucide-react";
import { TabValue } from "../../types";

interface QuestionTabsProps {
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
  activeCount: number;
  pendingCount: number;
  completedCount: number;
  rejectedCount: number;
  totalCount: number;
  children: React.ReactNode;
}

export const QuestionTabs = ({
  activeTab,
  onTabChange,
  activeCount,
  pendingCount,
  completedCount,
  rejectedCount,
  totalCount,
  children
}: QuestionTabsProps) => {
  return (
    <Tabs 
      defaultValue="active" 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as TabValue)} 
      className="w-full"
    >
      <TabsList className="flex lg:flex-1 flex-wrap gap-1 mb-16 lg:mb-4 p-1 bg-muted/30 rounded-lg">
        <TabsTrigger
          value="active"
          className="flex items-center gap-1.5 min-w-[4.5rem] flex-grow basis-[calc(50%-0.25rem)] sm:basis-auto md:flex-1"
        >
          <CheckCheck className="h-4 w-4" />
          <span>Активные</span>
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center"
            >
              {activeCount}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger
          value="pending"
          className="flex items-center gap-1.5 min-w-[4.5rem] flex-grow basis-[calc(50%-0.25rem)] sm:basis-auto md:flex-1"
        >
          <Clock className="h-4 w-4" />
          <span>Ожидающие</span>
          {pendingCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center"
            >
              {pendingCount}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger
          value="completed"
          className="flex items-center gap-1.5 min-w-[4.5rem] flex-grow basis-[calc(50%-0.25rem)] sm:basis-auto md:flex-1"
        >
          <CheckCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Завершенные</span>
          <span className="sm:hidden">Заверш.</span>
          {completedCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center"
            >
              {completedCount}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger
          value="rejected"
          className="flex items-center gap-1.5 min-w-[4.5rem] flex-grow basis-[calc(50%-0.25rem)] sm:basis-auto md:flex-1"
        >
          <XOctagon className="h-4 w-4" />
          <span className="hidden sm:inline">Отклоненные</span>
          <span className="sm:hidden">Откл.</span>
          {rejectedCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center"
            >
              {rejectedCount}
            </Badge>
          )}
        </TabsTrigger>

        <TabsTrigger
          value="all"
          className="flex items-center gap-1.5 min-w-[4.5rem] flex-grow basis-[calc(50%-0.25rem)] sm:basis-auto md:flex-1"
        >
          <span className="hidden sm:inline">Все вопросы</span>
          <span className="sm:hidden">Все</span>
          {totalCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-auto h-5 min-w-5 px-1 flex items-center justify-center"
            >
              {totalCount}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};