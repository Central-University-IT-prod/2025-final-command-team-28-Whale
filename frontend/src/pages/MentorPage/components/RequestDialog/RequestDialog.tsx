import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { MentorProfileType } from "../../types";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from 'sonner';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: MentorProfileType;
}

const SEND_REQUEST = gql`
  mutation SendRequest(
    $studentId: UUID!
    $mentorId: UUID!
    $question: String!
  ) {
    createMentorshipRequest(
      input: {
        studentId: $studentId
        mentorId: $mentorId
        question: $question
      }
    ) {
      mentorId
      requestId
      status
      studentId
    }
  }
`;

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      ... on StudentType {
        id
      }
      ... on MentorType {
        id
      }
    }
  }
`;

export const RequestDialog = ({
  isOpen,
  onOpenChange,
  mentor,
}: RequestDialogProps) => {
  const navigate = useNavigate();
  const [requestText, setRequestText] = useState<string>("");

  const [sendRequest] = useMutation(SEND_REQUEST);

  const { loading, data } = useQuery(GET_CURRENT_USER);

  const handleSubmit = () => {
    if (!requestText.trim()) return;
    if (!loading && data) {
      sendRequest({
        variables: {
          studentId: data.getCurrentUser.id,
          mentorId: mentor.id,
          question: requestText,
        },
      })
      .then(() => {
        toast("Ваша заявка успешно отправлена!");
        onOpenChange(false);
      })
    } else {
      navigate({
        to: "/auth",
        search: {
          request: JSON.stringify({
            mentorId: mentor.id,
            problem: requestText,
          }),
        },
      });
    }

    setRequestText("");
    onOpenChange(false);
  };

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" onClick={handleDialogClick}>
        <DialogHeader>
          <DialogTitle>Оставить заявку ментору {mentor.name}</DialogTitle>
        </DialogHeader>
        <div className="py-3 space-y-4">
          <Textarea
            placeholder="Опишите вашу проблему или вопрос..."
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            className="min-h-[150px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} disabled={!requestText.trim()}>
              Отправить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
