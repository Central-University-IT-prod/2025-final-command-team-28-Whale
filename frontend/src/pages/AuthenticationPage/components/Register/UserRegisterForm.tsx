import { type FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRegisterFormData } from "../../schemas";

interface UserRegisterFormProps {
  form: UseFormReturn<UserRegisterFormData>;
  onSubmit: (data: UserRegisterFormData) => void;
}

export const UserRegisterForm: FC<UserRegisterFormProps> = ({ 
  form, 
  onSubmit 
}) => {
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
    >
      <div className="space-y-3">
        <Label className="text-sm lg:text-base">Email</Label>
        <Input
          className="text-sm lg:text-base"
          type="email"
          placeholder="example@mail.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm lg:text-base">Пароль</Label>
        <Input
          className="text-sm lg:text-base"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-3 lg:col-span-2">
        <Label className="text-sm lg:text-base">Подтвердите пароль</Label>
        <Input
          className="text-sm lg:text-base"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button 
        className="w-full lg:col-span-2 text-sm lg:text-base h-10 lg:h-14 text-white"
      >
        Зарегистрироваться
      </Button>
    </form>
  );
};