import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CheckCheck } from "lucide-react";
import { QuestionRequest } from "../../types";
import { formatDate } from "../../utils/formatters";
import { SocialLink } from "../ui/SocialLink";
import { StatusBadge } from "../ui/StatusLink";

interface StatusQuestionCardProps {
  question: QuestionRequest;
  onComplete?: (id: string) => void;
}

export const StatusQuestionCard = ({
  question,
  onComplete
}: StatusQuestionCardProps) => {
  return (
    <Card className={`
      mb-4 
      transition-all 
      duration-200 
      hover:shadow-md
      ${question.status === 'active' ? 'border-primary/30' : ''}
      ${question.status === 'rejected' ? 'border-destructive/30' : ''}
      ${question.status === 'completed' ? 'border-green-300/30' : ''}
    `}>
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarImage src={question.user.avatar} alt={question.user.name} />
              <AvatarFallback className="text-xs">{question.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{question.user.name}</CardTitle>
              <StatusBadge status={question.status} />
            </div>
          </div>
          <div className="flex gap-1 ml-auto">
            {question.user.socialLinks.map((link, idx) => (
              <SocialLink key={idx} type={link.type} url={link.url} />
            ))}
          </div>
        </div>
      </CardHeader>
      <Separator className="mb-3 mx-6 opacity-50" />
      <CardContent>
        <p className="text-foreground">{question.question}</p>
        <p className="text-xs text-muted-foreground mt-2">
          {formatDate(question.timestamp)}
        </p>
      </CardContent>
      {question.status === 'active' && onComplete && (
        <CardFooter className="flex justify-end pt-3">
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90"
            onClick={() => onComplete(question.id)}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Завершить вопрос
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
