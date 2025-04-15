import { Badge } from "@/components/ui/badge";
import { CheckCheck, XOctagon, CheckCircle, Clock } from "lucide-react";
import { QuestionStatus } from "../../types";

interface StatusBadgeProps {
  status: QuestionStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (status === 'active') {
    return (
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 px-2">
        <CheckCheck className="h-3 w-3" />
        Активные
      </Badge>
    );
  }

  if (status === 'rejected') {
    return (
      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-1 px-2">
        <XOctagon className="h-3 w-3" />
        Отклонено
      </Badge>
    );
  }

  if (status === 'completed') {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-600 border-green-200 flex items-center gap-1 px-2">
        <CheckCircle className="h-3 w-3" />
        Завершено
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-muted text-muted-foreground flex items-center gap-1 px-2">
      <Clock className="h-3 w-3" />
      Ожидает
    </Badge>
  );
};