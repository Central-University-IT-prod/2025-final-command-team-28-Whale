import { type FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginFormData } from "../../schemas";

interface LoginFormProps {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => void;
  onRegisterClick: () => void;
}

export const LoginForm: FC<LoginFormProps> = ({ 
  form, 
  onSubmit, 
  onRegisterClick 
}) => {
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl lg:text-2xl font-extrabold text-center">
          Вход в аккаунт
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="lg:grid lg:grid-cols-2 lg:gap-6"
        >
          <div className="space-y-3 lg:col-span-2">
            <Label htmlFor="login-email" className="text-sm lg:text-base">
              Email
            </Label>
            <Input
              id="login-email"
              type="email"
              defaultValue={"admin"}
              placeholder="example@mail.com"
              className="text-sm lg:text-base"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-3 mt-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-sm lg:text-base">
                Пароль
              </Label>
              <a href="#" className="text-sm lg:text-base text-blue-600 hover:underline">
                Забыли пароль?
              </a>
            </div>
            <Input
              id="login-password"
              type="password"
              defaultValue={"password"}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          
          <div className="mt-6 lg:col-span-2 lg:mt-8">
            <Button 
              type="submit" 
              className="w-full h-10 lg:h-14 text-sm lg:text-base text-white"
            >
              Войти
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pt-6">
        <p className="text-sm lg:text-base">
          Нет аккаунта?{" "}
          <button
            type="button"
            onClick={onRegisterClick}
            className="hover:underline font-medium"
          >
            Зарегистрироваться
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};