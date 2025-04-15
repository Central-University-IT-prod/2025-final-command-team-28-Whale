import { useState, useMemo } from "react";
import { MentorProfileType } from '@/pages/MentorPage/types';
import { MultiValue } from 'react-select';

export interface TagOption {
  value: string;
  label: string;
}

export function useMentorsFilter(mentors: MentorProfileType[] = []) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<MultiValue<TagOption>>([]);
  const allTags = useMemo<TagOption[]>(() => {
    const tagsSet = new Set<string>();
    
    mentors.forEach(mentor => {
      if (mentor.tags && Array.isArray(mentor.tags)) {
        mentor.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    
    return Array.from(tagsSet).map(tag => ({
      value: tag,
      label: tag,
    }));
  }, [mentors]);

  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    allTags,
    mentors
  };
}