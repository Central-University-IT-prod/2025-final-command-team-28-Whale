import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  ResponsiveContainer, 
  Tooltip,
  YAxis,
  LabelList
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { regStats } from "@/lib/mock";
import CustomTooltip from "./CustomTooltip";

const chartConfig = {
  regs: {
    label: "Регистрации",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

const RegistrationChart = () => {
  return (
    <ChartContainer config={chartConfig} className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={regStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid 
            vertical={false} 
            strokeDasharray="3 3" 
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            className="text-gray-800 dark:text-gray-200"
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("ru-RU", {
                month: 'short',
                day: 'numeric'
              })
            }
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-gray-800 dark:text-gray-200"
          />
          <Tooltip 
            cursor={{ 
              fill: "rgba(0,0,0,0.1)",
              className: "dark:fill-gray-800" 
            }}
            content={<CustomTooltip />}
          />
          <Bar 
            dataKey="regs" 
            fill="var(--color-chart-1)"
            radius={[8, 8, 0, 0]}
            animationDuration={400}
          >
            <LabelList 
              dataKey="regs" 
              position="top"
              className="fill-gray-800 dark:fill-gray-200"
              formatter={(value: number) => value > 0 ? value : ''}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RegistrationChart;