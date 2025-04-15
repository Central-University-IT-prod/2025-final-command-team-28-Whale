import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { UserRegisterFormData, MentorRegisterFormData } from "../../schemas";
import {
  generateUserRegisterData,
  generateMentorRegisterData,
} from "../../utils/mockDataGenerator";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCookies } from "react-cookie";
import { toast } from 'sonner';

const REGISTER_STUDENT = gql`
  mutation RegisterStudent(
    $email: String!
    $password: String!
    $username: String!
  ) {
    registerStudent(
      input: { email: $email, password: $password, username: $username }
    ) {
      sessionId
    }
  }
`;

const REGISTER_MENTOR = gql`
  mutation RegisterMentor(
    $email: String!
    $password: String!
    $username: String!
    $expertise: String!
  ) {
    registerMentor(
      input: {
        email: $email
        password: $password
        username: $username
        expertise: $expertise
      }
    ) {
      requestId
    }
  }
`;

const LOGIN_USER = gql`
  query LoginUser($email: String!, $password: String!) {
    authExistsUser(
      input: { email: $email, password: $password, rembmerMe: true }
    ) {
      userId
      sessionId
      authType
    }
  }
`;

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

const QuickRegister = () => {
  const [cookies, setCookie] = useCookies(["PROD_SESSION", "PROD_USERID"]);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const [username, setUsername] = useState<string>("");
  const [mockUserData, setMockUserData] = useState<UserRegisterFormData | null>(
    null
  );
  const [mockMentorData, setMockMentorData] =
    useState<MentorRegisterFormData | null>(null);

  const generateMockData = () => {
    setMockUserData(generateUserRegisterData());
    setMockMentorData(generateMentorRegisterData());
  };

  useEffect(() => {
    generateMockData();
  }, []);

  const { refetch: loginRefetch } = useQuery(LOGIN_USER, {
    variables: {
      email: mockMentorData?.email,
      password: mockMentorData?.password,
    },
  });

  const [registerUser, { loading: userLoading }] =
    useMutation(REGISTER_STUDENT);

  const [sendRequest] = useMutation(SEND_REQUEST);

  const handleStudentLogin = () => {
    if (mockUserData) {
      registerUser({
        variables: {
          email: mockUserData.email,
          password: mockUserData.password,
          username: username,
        },
      }).then((userData) => {
        if (userData.data.registerStudent.sessionId) {
          const request = (searchParams as { request: string }).request;
          if (request) {
            const req = JSON.parse(request);
            sendRequest({
              variables: {
                studentId: userData.data.registerStudent.userId,
                mentorId: req["mentorId"],
                question: req["problem"],
              },
            })
            .then(() => {
              toast("Ваша заявка успешно отправлена!");
            })
          }

          setCookie("PROD_SESSION", userData.data.registerStudent.sessionId, {
            path: "/",
          });
          setCookie("PROD_USERID", userData.data.registerStudent.userId, {
            path: "/",
          });
          navigate({ to: "/" });
        }
      });
    }
  };

  const [registerMentor, { data: mentorData, loading: mentorLoading }] =
    useMutation(REGISTER_MENTOR);

  useEffect(() => {
    console.log(mentorData);
    if (mentorData?.registerMentor?.id) {
      navigate({ to: "/" });
    }
  }, [mentorData]);

  const handleMentorLogin = () => {
    if (mockMentorData) {
      registerMentor({
        variables: {
          email: mockMentorData.email,
          password: mockMentorData.password,
          username: username,
          expertise: "Ментор",
        },
      });
    }
  };

  useEffect(() => {
    if (!mentorLoading && mentorData && mockMentorData) {
      loginRefetch().then((userData: any) => {
          if (userData.data.authExistsUser.sessionId) {
            const request = (searchParams as { request: string }).request;
            if (request) {
              console.log(JSON.parse(request));
            }
  
            setCookie("PROD_SESSION", userData.data.authExistsUser.sessionId, {
              path: "/",
            });
            setCookie("PROD_USERID", userData.data.authExistsUser.userId, {
              path: "/",
            });
            navigate({ to: "/" });
          }
      });
    }
  }, [mentorLoading]);

  return (
    <div className="w-full flex flex-wrap gap-3">
      <Card className="w-full p-5 md:p-15">
        <header className="w-full font-bold text-center text-2xl mb-4">
          Быстрая регистрация
        </header>
        <div className="mb-4">
          <Input
            placeholder="Введите свое имя..."
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
            className="mb-2"
          />
          <p className="text-sm text-gray-500">
            Будут сгенерированы валидные данные для быстрой регистрации
          </p>
        </div>
        <div className="w-full flex flex-wrap justify-between gap-3 mb-2">
          <Button
            className="w-full md:w-[48%] text-white bg-blue-600 hover:bg-blue-700"
            onClick={username && !userLoading ? handleStudentLogin : () => {}}
          >
            {userLoading ? "Подождите..." : "Как студент"}
          </Button>
          <Button
            className="w-full md:w-[48%] text-white bg-green-600 hover:bg-green-700"
            onClick={username && !mentorLoading ? handleMentorLogin : () => {}}
          >
            {userLoading ? "Подождите..." : "Как ментор"}
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={generateMockData}
        >
          Сгенерировать новые данные
        </Button>
      </Card>
    </div>
  );
};

export default QuickRegister;
