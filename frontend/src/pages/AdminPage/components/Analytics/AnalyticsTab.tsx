import EngagementChart from './EngagementChart';
import SectionHeader from '../SectionHeader/SectionHeader';
import MentorActivityCards from './MentorActivityCard';
import RegistrationChart from './RegistrationTab';

const AnalyticsTab = () => {
  return (
    <div className="flex flex-wrap gap-5">
      <div className="w-full text-3xl font-bold dark:text-gray-100">Метрики</div>
      
      <div className="w-full flex flex-wrap gap-4">
        <SectionHeader 
          title="Зарегистрированные пользователи" 
          subtitle="Динамика регистраций за последний месяц"
        />
        <RegistrationChart />
      </div>

      <div className="w-full flex flex-wrap gap-4">
        <SectionHeader title="Активность менторов" />
        <MentorActivityCards />
      </div>

      <div className="w-full flex flex-wrap gap-4">
        <SectionHeader 
          title="Вовлечённость" 
          subtitle="Соотношение активных и неактивных менторов"
        />
        <EngagementChart />
      </div>
    </div>
  );
};

export default AnalyticsTab;