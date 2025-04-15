import { type FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRegisterForm } from "./UserRegisterForm";
import { MentorRegisterForm } from "./MentorRegisterForm";
import { RegistrationSuccess } from "../RegistrationSuccess/RegistrationSuccess";
import { RegisterType } from "../../types";
import { UserRegisterFormData, MentorRegisterFormData } from "../../schemas";

interface RegisterFormProps {
  registerType: RegisterType;
  setRegisterType: (type: RegisterType) => void;
  registrationSuccess: boolean;
  setRegistrationSuccess: (success: boolean) => void;
  onLoginClick: () => void;
  userForm: UseFormReturn<UserRegisterFormData>;
  mentorForm: UseFormReturn<MentorRegisterFormData>;
  handleUserRegisterSubmit: (data: UserRegisterFormData) => void;
  handleMentorRegisterSubmit: (data: MentorRegisterFormData) => void;
  tags: string[];
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

export const RegisterForm: FC<RegisterFormProps> = ({
  registerType,
  setRegisterType,
  registrationSuccess,
  setRegistrationSuccess,
  onLoginClick,
  userForm,
  mentorForm,
  handleUserRegisterSubmit,
  handleMentorRegisterSubmit,
  tags,
  currentTag,
  setCurrentTag,
  addTag,
  removeTag
}) => {
  return (
    <Card className="shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="pb-1 lg:pb-2">
        <CardTitle className="text-xl lg:text-2xl font-extrabold text-center">
          Регистрация
        </CardTitle>
      </CardHeader>
      <CardContent>
        {registrationSuccess ? (
          <RegistrationSuccess 
            onLoginClick={() => {
              setRegistrationSuccess(false);
              onLoginClick();
            }}
          />
        ) : (
          <>
            <div className="mb-6 lg:mb-8">
              <RadioGroup
                defaultValue={registerType}
                onValueChange={(value) => setRegisterType(value as RegisterType)}
                className="flex flex-wrap justify-between gap-4 lg:gap-6"
              >
                <label 
                  htmlFor="user-type" 
                  className={`w-full md:w-[48%] flex items-center space-x-3 border p-4 rounded-xl hover:border-rose-900 transition-colors cursor-pointer`}
                >
                  <RadioGroupItem 
                    value="user" 
                    id="user-type" 
                    className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" 
                  />
                  <span className="text-sm lg:text-base">
                    Пользователь
                  </span>
                </label>
                
                <label 
                  htmlFor="mentor-type" 
                  className={`w-full md:w-[48%] flex items-center space-x-3 border p-4 rounded-xl hover:border-rose-900 transition-colors cursor-pointer`}
                >
                  <RadioGroupItem 
                    value="mentor" 
                    id="mentor-type" 
                    className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" 
                  />
                  <span className="text-sm lg:text-base">
                    Ментор
                  </span>
                </label>
              </RadioGroup>
            </div>
            {registerType === "user" ? (
              <UserRegisterForm 
                form={userForm} 
                onSubmit={handleUserRegisterSubmit} 
              />
            ) : (
              <MentorRegisterForm 
                form={mentorForm} 
                onSubmit={handleMentorRegisterSubmit}
                tags={tags}
                currentTag={currentTag}
                setCurrentTag={setCurrentTag}
                addTag={addTag}
                removeTag={removeTag}
              />
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center pt-2">
        <p className="text-sm lg:text-base">
          Уже есть аккаунт?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-blue-600 hover:underline font-medium"
          >
            Войти
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};