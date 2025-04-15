import { useState } from "react";
import { Edit, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditAvatarDialog } from "../../components/EditAvatarDialog/EditAvatarDialog";
import { EditProfileDialog } from "../../components/EditProfileDialog/EditProfileDialog";
import { ProfileHeader } from "../../components/ProfileHeader/ProfileHeader";
import { ProfileTags } from "../../components/ProfileTags/ProfileTags";
import { SocialLinks } from "../../components/SocialLinks/SocialLinks";
import { MentorProfileType } from "../../types";
import { gql, useQuery } from "@apollo/client";

interface MentorProfileProps {
  mentor: MentorProfileType;
  onOpenRequest: () => void;
  onUpdateMentor: (mentor: MentorProfileType) => void;
}

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      ... on StudentType {
        id
        username
      }
      ... on MentorType {
        id
        username
        expertise
      }
    }
  }
`;

export const MentorProfile = ({
  mentor,
  onOpenRequest,
  onUpdateMentor,
}: MentorProfileProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);

  const handleStartEditingProfile = () => {
    setIsEditingProfile(true);
  };

  const handleAvatarClick = () => {
    setIsEditingAvatar(true);
  };

  const { loading: currentLoading, data: currentData } =
    useQuery(GET_CURRENT_USER);

  return (
    <div className="flex flex-col items-center mb-12 relative">
      <span
        className="absolute left-0 border-2 p-1
      rounded-md border-rose-700 text-rose-700"
      >
        Ментор
      </span>
      {!currentLoading &&
      currentData &&
      mentor.id === currentData.getCurrentUser.id ? (
        <Button
          variant="outline"
          size="sm"
          className="absolute -top-10 lg:top-0 lg:right-0 flex items-center gap-1"
          onClick={handleStartEditingProfile}
        >
          <Edit size={16} />
          <span>Редактировать профиль</span>
        </Button>
      ) : (
        ""
      )}

      <ProfileHeader
        avatar={mentor.avatarUrl}
        name={mentor.name}
        onAvatarClick={handleAvatarClick}
      />

      <SocialLinks socialLinks={mentor.links || []} />

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">{mentor.name}</h1>

      <p className="text-muted-foreground text-center max-w-xl mb-6">
        {mentor.description}
      </p>

      <ProfileTags tags={mentor.tags} />
      {!currentLoading &&
      currentData &&
      mentor.id === currentData.getCurrentUser.id ? (
        ""
      ) : (
        <Button className="mb-5" onClick={onOpenRequest}>
          Оставить заявку
        </Button>
      )}

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1 text-amber-500 mb-1">
          {new Array(Math.floor(Math.floor(mentor.rating / 0.5) / 2))
            .fill(0)
            .map((_k, i) => (
              <Star key={i} fill="currentColor" size={20} />
            ))}
          {new Array(Math.floor(mentor.rating / 0.5) % 2)
            .fill(0)
            .map((_k, i) => (
              <StarHalf key={i} fill="currentColor" size={20} />
            ))}
        </div>
        <span className="text-sm text-muted-foreground">
          Рейтинг: {mentor.rating.toFixed(1)}
        </span>
      </div>

      <EditProfileDialog
        isOpen={isEditingProfile}
        onOpenChange={setIsEditingProfile}
        mentor={mentor}
        onSave={(updatedMentor) => {
          onUpdateMentor(updatedMentor);
          setIsEditingProfile(false);
        }}
      />

      <EditAvatarDialog
        isOpen={isEditingAvatar}
        onOpenChange={setIsEditingAvatar}
        mentor={mentor}
        onSave={(updatedMentor) => {
          onUpdateMentor(updatedMentor);
          setIsEditingAvatar(false);
        }}
      />
    </div>
  );
};
