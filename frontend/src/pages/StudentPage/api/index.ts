import { gql } from "@apollo/client";

export const GET_STUDENT_BY_ID = gql`
  query GetStudentById($id: UUID!) {
    getStudentById(id: $id) {
      id
      username
      email
      links
      avatarUrl
      description
    }
  }
`;