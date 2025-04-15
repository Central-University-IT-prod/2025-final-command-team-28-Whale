import { useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { RequestDialog } from "./components/RequestDialog/RequestDialog";
import { ReviewSection } from "./components/ReviewSection/ReviewSection";
import { MentorProfile } from "./modules/MentorProfile/MentorProfile";
import { MentorProfileType } from "./types";
import { gql, useQuery } from "@apollo/client";

const GET_MENTOR_BY_ID = gql`
  query GetMentorById($mentorId: UUID!) {
    getMentorById(id: $mentorId) {
      id
      email
      username
      expertise
      tags
      description
      avatarUrl
      reviews {
        mentorId
        text
        stars
        studentId
      }
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

const MentorPage = () => {
  const { mentorId } = useParams({ from: "/mentors/$mentorId" });
  const [isRequestOpened, setIsRequestOpened] = useState<boolean>(false);
  const [editableMentor, setEditableMentor] =
    useState<MentorProfileType | null>(null);

  console.log("mentorId:", mentorId);

    const { loading: currentLoading, data: currentData } =
      useQuery(GET_CURRENT_USER);

  const { loading, error, data } = useQuery(GET_MENTOR_BY_ID, {
    variables: { mentorId },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.error("GraphQL error:", error);
    },
  });

  useEffect(() => {
    console.log("Query data:", data);
    console.log("Loading state:", loading);
    console.log("Error state:", error);
  }, [data, loading, error]);

  useEffect(() => {
    console.log("вадн");
    if (data?.getMentorById) {
      console.log("asdsad");
      const mentor = data.getMentorById;
      console.log("Mentor data:", mentor);

      try {
        console.log("Processed mentor profile:");

        const mentorProfile: MentorProfileType = {
          id: mentor.id,
          name: mentor.username,
          username: mentor.username,
          description: mentor.description || "",
          avatarUrl: mentor.avatarUrl || "",
          tags: Array.isArray(mentor.tags) ? mentor.tags : [],
          expertise: mentor.expertise || "",
          rating: 0,
          reviews: mentor.reviews,
          links: mentor.links
            ? typeof mentor.links === "string"
              ? JSON.parse(mentor.links)
              : mentor.links
            : [],
        };

        setEditableMentor(mentorProfile);
      } catch (err) {
        console.error("Error processing mentor data:", err);
      }
    }
  }, [data]);

  // Улучшенный индикатор загрузки
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Загрузка данных ментора...</p>
        </div>
      </div>
    );
  }

  // Более информативное сообщение об ошибке
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-700 text-lg font-medium mb-2">
            Произошла ошибка при загрузке данных
          </h2>
          <p className="text-red-600">{error.message}</p>
          <p className="mt-2 text-sm text-gray-600">
            Пожалуйста, попробуйте обновить страницу или вернитесь позже.
          </p>
        </div>
      </div>
    );
  }

  // Проверяем наличие данных
  if (!editableMentor) {
    // Проверим, есть ли данные от API, но по какой-то причине не установлены в состояние
    if (data?.getMentorById) {
      console.warn("Данные получены, но не обработаны:", data.getMentorById);
    }

    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h2 className="text-yellow-700 text-lg font-medium mb-2">
            Ментор не найден
          </h2>
          <p className="text-gray-600">
            Не удалось найти ментора с ID: {mentorId}
          </p>
        </div>
      </div>
    );
  }

  console.log("editablementor", editableMentor);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <MentorProfile
        mentor={editableMentor}
        onOpenRequest={() => setIsRequestOpened(true)}
        onUpdateMentor={(updatedMentor) => setEditableMentor(updatedMentor)}
      />
      {
        !currentLoading &&
        currentData &&
        mentorId === currentData.getCurrentUser.id
        ?
        ''
        :
      <ReviewSection mentor={editableMentor} />
      }

      <RequestDialog
        isOpen={isRequestOpened}
        onOpenChange={setIsRequestOpened}
        mentor={editableMentor}
      />
    </div>
  );
};

export default MentorPage;
