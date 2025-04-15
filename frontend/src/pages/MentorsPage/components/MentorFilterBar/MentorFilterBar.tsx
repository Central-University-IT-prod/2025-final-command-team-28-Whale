import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import CreatableSelect from "react-select/creatable";
import { MultiValue } from "react-select";
import { Search, Loader } from "lucide-react";
import { TagOption } from "../../hooks/useMentorsFilter";
import { frequentProblems } from "@/lib/mock";
import { ArrowUp, Eraser } from "lucide-react";

interface MentorsFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: MultiValue<TagOption>;
  onTagsChange: (value: MultiValue<TagOption>) => void;
  allTags: TagOption[];
  isLoading?: boolean;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const MentorsFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagsChange,
  allTags,
  isLoading = false,
}: MentorsFilterBarProps) => {
  const [focused, setFocused] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedValue = useDebounce(inputValue, 400);
  const [isDebouncing, setIsDebouncing] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (inputValue !== debouncedValue) {
      setIsDebouncing(true);
    } else {
      setIsDebouncing(false);
    }
  }, [inputValue, debouncedValue]);

  useEffect(() => {
    if (debouncedValue !== searchQuery) {
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue, onSearchChange, searchQuery]);

  const handleCreateOption = (inputValue: string) => {
    const newOption: TagOption = {
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
      label: inputValue,
    };

    onTagsChange([...selectedTags, newOption]);
  };

  return (
    <div className="sticky top-20 z-10 w-full border-accent-foreground mb-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl shadow-xl p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            className="pl-10 h-12 bg-gray-50 border-gray-200 dark:bg-accent-foreground"
            placeholder="Поиск по имени или описанию..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            ref={inputRef}
            onClick={() => setFocused(focused => !focused)}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                setFocused(false);
              }
            }}
          />
          {focused ? (
            <div 
              className="flex flex-wrap absolute top-14 z-30 w-full p-3 bg-white rounded-xl"
              ref={dropdownRef}
            >
              <div className="w-full flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-100 transition rounded-xl text-gray-700"
                onClick={() => setInputValue('')}
              >
                <Eraser className='w-4 h-4' stroke='currentColor' />
                <span>Очистить</span>
              </div>
              {frequentProblems.map((problem, index) => (
                <div
                  className="w-full flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-gray-100 transition rounded-xl text-gray-700"
                  key={index}
                  onClick={() => {
                    setInputValue(problem);
                    setFocused(false);
                  }}
                >
                  <ArrowUp className='w-4 h-4' stroke='currentColor' />
                  <span>{problem}</span>
                </div>
              ))}
            </div>
          ) : null}
          {(isDebouncing || isLoading) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader className="animate-spin text-gray-400" size={18} />
            </div>
          )}
        </div>
        <div className="w-full md:w-2/5">
          <CreatableSelect<TagOption, true>
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Фильтр по навыкам"
            options={allTags}
            isMulti
            closeMenuOnSelect={false}
            value={selectedTags}
            onChange={onTagsChange}
            onCreateOption={handleCreateOption}
            formatCreateLabel={(inputValue) => `Создать "${inputValue}"`}
            isDisabled={isLoading}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                minHeight: "3rem",
                backgroundColor: "dark:bg-accent-foreground",
                borderColor: state.isFocused
                  ? "var(--select-border-focus)"
                  : "var(--select-border)",
                boxShadow: state.isFocused
                  ? "0 0 0 1px var(--select-border-focus)"
                  : "none",
                "&:hover": {
                  borderColor: state.isFocused
                    ? "var(--select-border-focus)"
                    : "var(--select-border-hover)",
                },
                opacity: isLoading ? 0.7 : 1,
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--select-menu-bg)",
                zIndex: 50,
              }),
              option: (baseStyles, { isDisabled, isFocused, isSelected }) => ({
                ...baseStyles,
                backgroundColor: isSelected
                  ? "var(--select-option-selected-bg)"
                  : isFocused
                  ? "var(--select-option-focus-bg)"
                  : "var(--select-menu-bg)",
                color: isSelected
                  ? "var(--select-option-selected-text)"
                  : "var(--select-option-text)",
                cursor: isDisabled ? "not-allowed" : "default",
                ":active": {
                  backgroundColor: isSelected
                    ? "var(--select-option-selected-bg)"
                    : "var(--select-option-active-bg)",
                },
              }),
              multiValue: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "var(--select-multi-bg)",
              }),
              multiValueLabel: (baseStyles) => ({
                ...baseStyles,
                color: "var(--select-multi-text)",
              }),
              multiValueRemove: (baseStyles) => ({
                ...baseStyles,
                color: "var(--select-multi-remove)",
                ":hover": {
                  backgroundColor: "var(--select-multi-remove-hover-bg)",
                  color: "var(--select-multi-remove-hover-text)",
                },
              }),
              input: (baseStyles) => ({
                ...baseStyles,
                color: "var(--select-input-text)",
              }),
              placeholder: (baseStyles) => ({
                ...baseStyles,
                color: "var(--select-placeholder)",
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: "var(--select-value-text)",
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
};