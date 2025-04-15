import { Card, CardContent } from "@/components/ui/card";
import { TabValue } from "../../types";
import { getEmptyStateIcon, getEmptyStateText } from "../../utils/tab-helpers";

interface EmptyQuestionStateProps {
  tabValue: TabValue;
}

export const EmptyQuestion = ({ tabValue }: EmptyQuestionStateProps) => {
  return (
    <Card className="bg-card border-dashed">
      <CardContent className="py-10 text-center text-muted-foreground flex flex-col items-center">
        {getEmptyStateIcon(tabValue)}
        <p>{getEmptyStateText(tabValue)}</p>
        {tabValue === 'pending' && (
          <p className="text-sm mt-1">Все текущие вопросы обработаны</p>
        )}
      </CardContent>
    </Card>
  );
};