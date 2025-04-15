import { MultiValue } from "react-select";
import { MentorsFilterBar } from "./components/MentorFilterBar/MentorFilterBar";
import { TagOption, useMentorsFilter } from "./hooks/useMentorsFilter";
import { MentorsHeader } from "./modules/MentorsHeader/MentorsHeader";
import { MentorsList } from "./modules/MentorsList/MentorsList";
import { gql, useQuery } from "@apollo/client";
import { useCallback, useMemo } from "react";
import { MentorProfileType } from "@/pages/MentorPage/types";

const GET_ALL_MENTORS = gql`
  query GetAllMentors($query: String, $tags: [String!]) {
    getAllMentors(query: $query, tags: $tags) {
      id
      username
      email
      avatarUrl
      description
      tags
      expertise
      
    }
  }
`;

const MentorsPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_MENTORS, {
    variables: {
      query: "",
      tags: [],
    },
  });

  const processedMentors = useMemo(
    () =>
      data?.getAllMentors?.map((mentor: MentorProfileType) => ({
        ...mentor,
        tags: Array.isArray(mentor.tags) ? mentor.tags : [],
        rating: mentor.rating || 5,
      })) || [],

    [data]
  );


  const {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    allTags,
    mentors: filteredMentors,
  } = useMentorsFilter(processedMentors);

  const handleSearchChange = useCallback(
    (search: string) => {
      setSearchQuery(search);
      refetch({
        query: search,
        tags: selectedTags.map((tag) => tag.value),
      });
    },
    [selectedTags, refetch, setSearchQuery]
  );

  const handleTagsChange = useCallback(
    (tags: MultiValue<TagOption>) => {
      setSelectedTags(tags);
      refetch({
        query: searchQuery,
        tags: tags.map((tag) => tag.value),
      });
    },
    [searchQuery, refetch, setSelectedTags]
  );

  const sortedMentors = useMemo(
    () =>
      [...filteredMentors].sort((a, b) => (b.rating || 0) - (a.rating || 0)),
    [filteredMentors]
  );

  return (
    <div className="container mx-auto px-4">
      <MentorsHeader />

      <MentorsFilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedTags={selectedTags}
        onTagsChange={handleTagsChange}
        allTags={allTags}
        isLoading={loading}
      />

      {error ? (
        <div className="w-full text-red-500 py-4">
          Ошибка загрузки данных: {error.message}
        </div>
      ) : loading ? (
        <div className="w-full text-center py-8">
          Загрузка списка менторов...
        </div>
      ) : (
        <MentorsList mentors={sortedMentors} />
      )}
    </div>
  );
};

export default MentorsPage;
