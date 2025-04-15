import { useState } from "react";
import { AuthTabs } from "./modules/AuthTabs";
import { Button } from '@/components/ui/button';
import QuickLogin from "./components/QuickRegister/QuickRegister";

const AuthenticationPage = () => {
  const [isQuick, setIsQuick] = useState<boolean>(true);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full flex flex-wrap justify-center max-w-xl xl:max-w-2xl gap-3">
        {isQuick ? <QuickLogin /> : <AuthTabs />}
        <Button className="w-full text-white" onClick={() => setIsQuick(isQuick => !isQuick)}>
          {
            isQuick
            ?
            'Через логин/пароль'
            :
            'Быстрая регистрация'
          }
        </Button>
      </div>
    </div>
  );
};

export default AuthenticationPage;
