import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VerificationFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const VerificationFilters = ({ onSearch, onFilterChange }: VerificationFiltersProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <form 
        className="flex-1 relative" 
        onSubmit={handleSearchSubmit}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          placeholder="Поиск по имени..."
          className="pl-10"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </form>
      <div className="flex gap-3">
        <Select onValueChange={onFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все запросы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все запросы</SelectItem>
            <SelectItem value="pending">Ожидающие</SelectItem>
            <SelectItem value="approved">Одобренные</SelectItem>
            <SelectItem value="rejected">Отклоненные</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default VerificationFilters;