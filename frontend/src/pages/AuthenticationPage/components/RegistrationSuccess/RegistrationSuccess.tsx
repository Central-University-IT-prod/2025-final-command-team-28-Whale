import { type FC } from "react";
import { Button } from "@/components/ui/button";

interface RegistrationSuccessProps {
  onLoginClick: () => void;
}

export const RegistrationSuccess: FC<RegistrationSuccessProps> = ({ onLoginClick }) => {
  return (
    <div className="text-center py-8 lg:py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-green-100 mb-4">
        <svg 
          className="w-8 h-8 lg:w-10 lg:h-10 text-green-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7" 
          />
        </svg>
      </div>
      <h3 className="text-xl lg:text-2xl font-medium text-gray-900 mb-2">
        Регистрация прошла успешно!
      </h3>
      <p className="text-gray-600 mb-4 lg:text-lg">
        Ваш аккаунт был успешно создан.
      </p>
      <Button 
        onClick={onLoginClick}
        className="px-8 py-4 lg:px-10 lg:py-5 text-sm lg:text-base"
      >
        Перейти к входу
      </Button>
    </div>
  );
};