import { type FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { MentorRegisterFormData } from "../../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface MentorRegisterFormProps {
  form: UseFormReturn<MentorRegisterFormData>;
  onSubmit: (data: MentorRegisterFormData) => void;
  tags: string[];
  currentTag: string;
  setCurrentTag: (tag: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

export const MentorRegisterForm: FC<MentorRegisterFormProps> = ({ 
  form, 
  onSubmit,
  tags,
  currentTag,
  setCurrentTag,
  addTag,
  removeTag
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

      <div className="space-y-3 lg:col-span-2">
        <Label className="text-sm lg:text-base">Ваш контакт для связи (телеграм) *</Label>
        <Input
          className="text-sm lg:text-base"
          type="text"
          placeholder='https://t.me/username'
          {...register("contact")}
        />
        {errors.contact && (
          <p className="text-sm text-red-500 mt-1">
            {errors.contact.message}
          </p>
        )}
      </div>

      <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="space-y-3">
          <Label className="text-sm lg:text-base">Специализация *</Label>
          <Input
            className="text-sm lg:text-base"
            type="text"
            placeholder="Веб-разработка"
            {...register("expertise")}
          />
          {errors.expertise && (
            <p className="text-sm text-red-500 mt-1">
              {errors.expertise.message}
            </p>
          )}
        </div>

        <div className="space-y-3 lg:col-span-2">
          <Label className="text-sm lg:text-base">Теги</Label>
          <div className="flex gap-2">
            <Input
              className="text-sm lg:text-base flex-1"
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Добавьте тег"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button
              type="button"
              onClick={addTag}
              variant="secondary"
              className="px-6 text-sm lg:text-base"
            >
              Добавить
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Badge 
            key={tag} 
            variant="secondary" 
            className="flex items-center gap-1 h-8 px-3 text-sm bg-accent text-white"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        ))}
      </div>

      <Button 
        type="submit" 
        className="w-full lg:col-span-2 text-sm lg:text-base h-10 lg:h-14 text-white"
      >
        Зарегистрироваться
      </Button>
    </form>
  );
};