import { useQuery } from "@apollo/client";
import { GET_STUDENT_BY_ID } from "../api";
import { parseSocialLinks } from "../utils/socialMediaUtils";

export const useStudentData = (studentId: string) => {
  const { loading, error, data } = useQuery(GET_STUDENT_BY_ID, {
    variables: { id: studentId },
  });

  const processedData = data?.getStudentById 
    ? {
        id: data.getStudentById.id,
        name: data.getStudentById.username,
        description: data.getStudentById.description || "Описание отсутствует",
        avatar: data.getStudentById.avatarUrl || "",
        rating: data.getStudentById.rating || 0,
        socialLinks: parseSocialLinks(data.getStudentById.links)
      }
    : null;

  return {
    loading,
    error,
    student: processedData
  };
};