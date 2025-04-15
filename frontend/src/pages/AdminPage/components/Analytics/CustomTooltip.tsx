interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length && label) {
    const formattedDate = new Date(label).toLocaleDateString("ru-RU", {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <div className="bg-background p-4 rounded-lg shadow-lg border dark:border-gray-700">
        <p className="font-medium dark:text-gray-200">{formattedDate}</p>
        <p className="text-sm dark:text-gray-300">
          {payload[0].dataKey === 'regs' ? 'Регистрации: ' : 'Пользователи: '}
          <span className="text-primary">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;