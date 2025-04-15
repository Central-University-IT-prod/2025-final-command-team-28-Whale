import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ReviewType } from "@/types/mentor";

interface ReviewCardProps {
  review: ReviewType;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">{review.studentId}</h3>
        <div className="flex items-center gap-1 text-amber-500">
          <span className="text-sm">{review.stars.toFixed(1)}</span>
          <Star fill="currentColor" size={16} />
        </div>
      </div>
      <p className="text-muted-foreground">{review.text}</p>
    </Card>
  );
};