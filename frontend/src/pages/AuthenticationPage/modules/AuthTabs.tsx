import { type FC } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "../components/LoginForm/LoginForm";
import { RegisterForm } from "../components/Register/RegisterForm";
import { useAuthForms }  from "../hooks/useAuthForm";
import { AuthTab } from "../types";

export const AuthTabs: FC = () => {
  const {
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
  } = useAuthForms();

  const handleTabChange = (value: string) => {
    setActiveTab(value as AuthTab);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-12 pb-6">
        <TabsTrigger 
          value="login" 
          className="text-[0.9375rem] py-2"
        >
          Вход
        </TabsTrigger>
        <TabsTrigger 
          value="register" 
          className="text-[0.9375rem] py-2"
        >
          Регистрация
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <LoginForm 
          form={loginForm} 
          onSubmit={handleLoginSubmit}
          onRegisterClick={() => setActiveTab("register")}
        />
      </TabsContent>

      <TabsContent value="register">
        <RegisterForm 
          registerType={registerType}
          setRegisterType={setRegisterType}
          registrationSuccess={registrationSuccess}
          setRegistrationSuccess={setRegistrationSuccess}
          onLoginClick={() => setActiveTab("login")}
          userForm={userRegisterForm}
          mentorForm={mentorRegisterForm}
          handleUserRegisterSubmit={handleUserRegisterSubmit}
          handleMentorRegisterSubmit={handleMentorRegisterSubmit}
          tags={tags}
          currentTag={currentTag}
          setCurrentTag={setCurrentTag}
          addTag={addTag}
          removeTag={removeTag}
        />
      </TabsContent>
    </Tabs>
  );
};