import { MentorProfileType } from '@/pages/MentorPage/types';
import { EmptyMentorsState } from "../../components/EmptyMentorState/EmptyMentorState";
import { MentorCard } from "../../components/MentorCard/MentorCard";


interface MentorsListProps {
  mentors: Array<MentorProfileType>;
}

export const MentorsList = ({ mentors }: MentorsListProps) => {
  if (mentors.length === 0) {
    return <EmptyMentorsState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} />
      ))}
    </div>
  );
};