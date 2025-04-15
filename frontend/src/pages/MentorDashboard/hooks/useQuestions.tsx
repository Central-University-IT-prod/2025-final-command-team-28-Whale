import { useEffect, useState } from "react";
import { QuestionRequest, QuestionStatus } from "../types";
import { gql, useQuery } from "@apollo/client";
const GET_MENTOR_REQUESTS = gql`
  query GetMentorRequests($id: UUID!) {
    getRequestsByMentor(mentorId: $id) {
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
        username
      }
      ... on MentorType {
        id
        username
        expertise
      }
    }
  }
`;

export const useQuestions = (): any => {
  const { refetch: userRefetch } = useQuery(GET_CURRENT_USER);
  const { refetch: reqRefetch } = useQuery(GET_MENTOR_REQUESTS);
  const [questions, setQuestions] = useState<QuestionRequest[]>([]);
  useEffect(() => {
    userRefetch().then((userData: any) => {
      reqRefetch({
        id: userData.data.getCurrentUser.id,
      }).then((reqData) => {
        setQuestions(reqData.data.getRequests ?? []);
      })
    })
    }, []);

    const handleApprove = (id: string) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, status: "active" as QuestionStatus } : q
        )
      );
    };

    const handleReject = (id: string) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, status: "rejected" as QuestionStatus } : q
        )
      );
    };

    const handleComplete = (id: string) => {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, status: "completed" as QuestionStatus } : q
        )
      );
    };

    const pendingQuestions = questions.filter((q) => q.status === "pending");
    const activeQuestions = questions.filter((q) => q.status === "active");
    const rejectedQuestions = questions.filter((q) => q.status === "rejected");
    const completedQuestions = questions.filter(
      (q) => q.status === "completed"
    );

    return {
      questions,
      pendingQuestions,
      activeQuestions,
      rejectedQuestions,
      completedQuestions,
      handleApprove,
      handleReject,
      handleComplete,
    };
};
