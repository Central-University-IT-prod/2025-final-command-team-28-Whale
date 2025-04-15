import { Search } from "lucide-react";

export const EmptyMentorsState = () => {
  return (
    <div className="col-span-full py-16 text-center">
      <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
        <Search size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Менторы не найдены</h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Попробуйте изменить параметры поиска или фильтры
      </p>
    </div>
  );
};