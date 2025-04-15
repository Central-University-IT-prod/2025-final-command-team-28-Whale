import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { QuestionRequest } from "../../types";
import { formatDate } from "../../utils/formatters";
import { SocialLink } from "../ui/SocialLink";

interface QuestionCardProps {
  question: QuestionRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const QuestionCard = ({
  question,
  onApprove,
  onReject
}: QuestionCardProps) => {
  return (
    <Card className="mb-4 border border-border/50 transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2 space-y-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border/50">
              <AvatarImage src={question.user.avatar} alt={question.user.name} />
              <AvatarFallback className="text-xs">{question.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">{question.user.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" />
                {formatDate(question.timestamp)}
              </CardDescription>
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
      <CardContent className="py-2">
        <p className="text-muted-foreground mb-1 text-sm font-medium">Вопрос:</p>
        <p className="text-foreground">{question.question}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 pt-3">
        <Button
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onReject(question.id)}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Отклонить
        </Button>
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90"
          onClick={() => onApprove(question.id)}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Принять
        </Button>
      </CardFooter>
    </Card>
  );
};