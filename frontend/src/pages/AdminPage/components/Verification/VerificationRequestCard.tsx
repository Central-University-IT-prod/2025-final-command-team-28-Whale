import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Ban } from "lucide-react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate } from '@tanstack/react-router';

const CHANGE_STATUS = gql`
  mutation ChangeStatus($requestId: UUID!, $status: RequestStatusEnum!) {
    changeRequestStatusStudentMentor(requestId: $requestId, status: $status) {
      status
    }
  }
`;

const GET_MENTOR = gql`
  query GetMentor($id: UUID!) {
    getMentorById(id: $id) {
      username
      description
    }
  }
`;

interface VerificationRequest {
  id: string;
  userId: string;
}

interface VerificationRequestCardProps {
  request: VerificationRequest;
}

const VerificationRequestCard = ({ request }: VerificationRequestCardProps) => {
  const navigate = useNavigate();
  const [changeStatus] = useMutation(CHANGE_STATUS);
  const handleAccept = () => {
    console.log(request);
    changeStatus({
      variables: {
        requestId: request.id,
        status: "ACCEPTED",
      },
    });
    const hiddenItems = localStorage.getItem("hidden") ?? "[]";
    localStorage.setItem(
      "hidden",
      JSON.stringify([...JSON.parse(hiddenItems), request.id])
    );
    navigate({to: '.'});
  };

  const handleReject = () => {
    changeStatus({
      variables: {
        requestId: request.id,
        status: "REJECTED",
      },
    });
    const hiddenItems = localStorage.getItem("hidden") ?? "[]";
    localStorage.setItem(
      "hidden",
      JSON.stringify([...JSON.parse(hiddenItems), request.id])
    );
    navigate({to: '.'});
  };

  const { data: user } = useQuery(GET_MENTOR, {
    variables: {
      id: request.userId,
    },
  });

  return JSON.parse(localStorage.getItem("hidden") ?? "[]").includes(
    request.id
  ) ? (
    ""
  ) : (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 group hover:-translate-y-1 dark:bg-accent-foreground">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="font-semibold text-lg truncate dark:text-gray-200">
            {user ? user.getMentorById.username : ""}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3 dark:text-gray-300">
            {user ? user.getMentorById.description : ""}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1" onClick={handleAccept}>
            <Check className="h-4 w-4 mr-2" />
            Принять
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 dark:text-gray-200"
            onClick={handleReject}
          >
            <Ban className="h-4 w-4 mr-2" />
            Отклонить
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default VerificationRequestCard;
