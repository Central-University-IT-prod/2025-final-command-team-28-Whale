import VerificationRequestList from './VerificationRequestList';
import VerificationFilters from './VerificationFilters';
import { useState } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';

const VerificationTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="w-full">
      <SectionHeader 
        title="Запросы на верификацию"
        subtitle="Управление запросами на верификацию от менторов"
        className="mb-6"
      />
      <VerificationFilters 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      <VerificationRequestList />
    </div>
  );
};

export default VerificationTab;