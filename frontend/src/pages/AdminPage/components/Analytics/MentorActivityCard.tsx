import { TrendingUp, Calendar, Star } from "lucide-react";
import MetricCard from "../MetricCard/MetricCard";
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

const STATS_QUERY = gql`
  query GetMentorStatistic {
    getStatistic {
      activeMentors
      avgRate
      totalAcceptedRequests
    }
  }
`;

// Определим интерфейс для типизации данных
interface StatisticData {
  getStatistic: {
    activeMentors: number;
    avgRate: number;
    totalAcceptedRequests: number;
    registrations: Array<{
      regs: number;
      date: string;
    }>;
  }
}

const MentorActivityCards = () => {
  // Используем хук useQuery для запроса данных
  const { loading, error, data } = useQuery<StatisticData>(STATS_QUERY);
  
  // Состояние для хранения процентного изменения регистраций
  const [registrationChange, setRegistrationChange] = useState<string>("Загрузка...");
  console.log(data)
  // Вычисляем процентное изменение при получении данных
  useEffect(() => {
    if (data?.getStatistic?.registrations) {
      setRegistrationChange(calculateRegistrationChange());
    }
  }, [data]);

  // Функция для вычисления процентного изменения регистраций
  function calculateRegistrationChange(): string {
    if (!data?.getStatistic?.registrations || data.getStatistic.registrations.length < 2) {
      return "Нет данных";
    }

    // Берем сумму регистраций за последние 2 дня
    const latestRegs = data.getStatistic.registrations.slice(0, 2).reduce((sum, item) => sum + item.regs, 0);
    // Берем сумму регистраций за предыдущие 2 дня
    const previousRegs = data.getStatistic.registrations.slice(2, 4).reduce((sum, item) => sum + item.regs, 0);

    if (previousRegs === 0) return latestRegs > 0 ? "+100%" : "0%";

    const percentChange = ((latestRegs - previousRegs) / previousRegs) * 100;
    return `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(0)}% за месяц`;
  }

  // Функция для форматирования числа с разделителями тысяч
  function formatNumber(num: number): string {
    return new Intl.NumberFormat('ru-RU').format(num);
  }

  // Обработка состояния загрузки
  if (loading) return <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
    {[1, 2, 3].map(index => (
      <div key={index} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    ))}
  </div>;
  
  // Обработка ошибок
  if (error) return <div className="w-full p-4 text-center text-red-500">Ошибка загрузки данных: {error.message}</div>;

  // Извлекаем данные из результата запроса с дефолтными значениями
  const { activeMentors = 0, avgRate = 0, totalAcceptedRequests = 0 } = data?.getStatistic || {};

  // Вычисляем среднее количество встреч в день
  const avgMeetingsPerDay = totalAcceptedRequests > 0 ? Math.round(totalAcceptedRequests / 30) : 0;

  // Определяем форматированные значения
  const formattedActiveMentors = activeMentors > 0 ? formatNumber(activeMentors) : "0";
  const formattedTotalRequests = totalAcceptedRequests > 0 ? formatNumber(totalAcceptedRequests) : "0";
  const formattedAvgRate = avgRate > 0 ? avgRate.toFixed(1) : "0.0";
  
  // Подзаголовки с проверкой данных
  const mentorsSubtitle = activeMentors > 0 ? registrationChange : "Нет данных";
  const requestsSubtitle = totalAcceptedRequests > 0 ? `~${avgMeetingsPerDay} в день` : "Нет встреч";

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Активные менторы"
        value={formattedActiveMentors}
        subtitle={mentorsSubtitle}
        className="bg-gradient-to-br from-red-800 to-rose-500 text-white"
        icon={<TrendingUp className="h-5 w-5" />}
      />
      <MetricCard
        title="Всего встреч"
        value={formattedTotalRequests}
        subtitle={requestsSubtitle}
        className="bg-gray-50 dark:bg-accent-foreground"
        titleClassName="text-lg dark:text-gray-200"
        subtitleClassName="text-sm mt-2 opacity-70 dark:text-gray-300"
        icon={<Calendar className="h-5 w-5 dark:text-gray-300" />}
      />
      <MetricCard
        title="Средний рейтинг"
        value={formattedAvgRate}
        subtitle="из 5.0"
        className="bg-gray-50 dark:bg-accent-foreground"
        titleClassName="text-lg dark:text-gray-200"
        subtitleClassName="text-sm mt-2 opacity-70 dark:text-gray-300"
        icon={<Star className="h-5 w-5 text-yellow-500" />}
      />
    </div>
  );
};

export default MentorActivityCards;