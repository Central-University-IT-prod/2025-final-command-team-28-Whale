import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import CustomTooltip from './CustomTooltip';
import { gql, useQuery } from "@apollo/client";
import { useState, useEffect } from "react";

interface ChartDataItem {
  type: string;
  users: number;
  label: string;
}

interface StatisticData {
  getStatistic: {
    activeMentors: number;
    inactiveMentors: number;
  }
}

const ACTIVE_STATS_QUERY = gql`
  query GetMentorStatistic {
    getStatistic {
      activeMentors
      inactiveMentors
    }
  }
`;

const pieConfig = {
  active: {
    label: 'Активные менторы',
    color: 'var(--color-chart-2)'
  },
  inactive: {
    label: 'Неактивные менторы',
    color: 'var(--color-chart-3)'
  },
} satisfies ChartConfig;

const EngagementChart = () => {
  const { loading, error, data } = useQuery<StatisticData>(ACTIVE_STATS_QUERY);
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  
  useEffect(() => {
    if (data?.getStatistic) {
      const { activeMentors, inactiveMentors } = data.getStatistic;
      setChartData([
        { 
          type: 'active', 
          users: activeMentors, 
          label: 'Активные менторы' 
        },
        { 
          type: 'inactive', 
          users: inactiveMentors, 
          label: 'Неактивные менторы' 
        }
      ]);
    }
  }, [data]);

  if (loading) return <div className="w-full h-[500px] flex items-center justify-center">Загрузка данных...</div>;
  
  if (error) return <div className="w-full h-[500px] flex items-center justify-center">Ошибка загрузки данных: {error.message}</div>;

  return (
    <ChartContainer config={pieConfig} className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
          <Pie
            data={chartData}
            dataKey="users"
            nameKey="type"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            animationDuration={600}
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.type === 'active' ? 'var(--color-chart-2)' : 'var(--color-chart-3)'}
                className="stroke-background hover:opacity-80 transition-opacity cursor-pointer"
                strokeWidth={4}
              />
            ))}
          </Pie>
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ bottom: 20 }}
            payload={[
              { value: 'Активные', type: 'circle', color: 'var(--color-chart-2)' },
              { value: 'Неактивные', type: 'circle', color: 'var(--color-chart-3)' }
            ]}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'transparent' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default EngagementChart;