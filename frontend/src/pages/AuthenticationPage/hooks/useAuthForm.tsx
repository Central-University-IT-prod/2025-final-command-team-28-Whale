import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  userRegisterSchema,
  mentorRegisterSchema,
  LoginFormData,
  UserRegisterFormData,
  MentorRegisterFormData,
} from "../schemas";
import { AuthTab, RegisterType } from "../types";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

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

const REGISTER_STUDENT = gql`
  mutation RegisterStudent(
    $email: String!
    $password: String!
    $username: String!
  ) {
    registerStudent(
      input: { email: $email, password: $password, username: $username }
    ) {
      session_id
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
      request_id
    }
  }
`;

export function useAuthForms() {
  const [, setCookie] = useCookies(["PROD_SESSION", "PROD_USERID"]);
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });

  const [registerUser, { data: userRegData }] = useMutation(REGISTER_STUDENT);
  const [registerMentor, { data: mentorRegData }] =
    useMutation(REGISTER_MENTOR);

  const { refetch } = useQuery(LOGIN_USER, {
    variables: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userRegData?.registerStudent?.id) {
      const request = (searchParams as { request: string }).request;
      if (request) {
        console.log(JSON.parse(request));
      }
      navigate({ to: "/" });
    }
  }, [userRegData]);

  useEffect(() => {
    if (mentorRegData?.registerMentor?.id) {
      navigate({ to: "/" });
    }
  }, [mentorRegData]);

  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [registerType, setRegisterType] = useState<RegisterType>("user");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@gmail.com",
      password: "password",
      rememberMe: false,
    },
  });

  const userRegisterForm = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mentorRegisterForm = useForm<MentorRegisterFormData>({
    resolver: zodResolver(mentorRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      expertise: "",
      tags: [],
    },
  });

  const handleLoginSubmit = (data: LoginFormData) => {
    refetch({
      email: data.email,
      password: data.password,
    }).then((data) => {
      if (data.data.authExistsUser.authType === "admin") {
        navigate({ to: "/admin" });
      } else {
        setCookie("PROD_SESSION", data.data.authExistsUser.sessionId, {
          path: "/",
        });
        setCookie("PROD_USERID", data.data.authExistsUser.userId, {
          path: "/",
        });
        navigate({ to: "/" });
      }
    });
    // Логика авторизации
  };

  const handleUserRegisterSubmit = (data: UserRegisterFormData) => {
    registerUser({
      variables: {
        email: data.email,
        password: data.confirmPassword,
        username: data.email,
      },
    });
    setRegistrationSuccess(true);
    // Логика регистрации пользователя
  };

  const handleMentorRegisterSubmit = (data: MentorRegisterFormData) => {
    registerMentor({
      variables: {
        email: data.email,
        password: data.confirmPassword,
        username: data.email,
        expertise: data.expertise,
      },
    });
    setRegistrationSuccess(true);
    // Логика регистрации ментора
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return {
    activeTab,
    setActiveTab,
    registerType,
    setRegisterType,
    registrationSuccess,
    setRegistrationSuccess,
    tags,
    currentTag,
    setCurrentTag,
    loginForm,
    userRegisterForm,
    mentorRegisterForm,
    handleLoginSubmit,
    handleUserRegisterSubmit,
    handleMentorRegisterSubmit,
    addTag,
    removeTag,
  };
}
