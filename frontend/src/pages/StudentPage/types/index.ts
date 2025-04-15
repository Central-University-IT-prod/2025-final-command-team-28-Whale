export type Student = {
  id: string;
  username: string;
  email: string;
  links?: Record<string, string | unknown> | null;
  avatarUrl?: string | null;
  description?: string | null;
  rating?: number;
};

export interface SocialLinkType {
  type: string;
  url: string | unknown;
}

export interface EditableStudentProfile {
  id: string;
  name: string;
  description: string;
  avatar: string;
  rating: number;
  links: Array<SocialLinkType> | null;
}

export interface RatingStarProps {
  index: number;
  rating: number;
  hoverRating: number;
  isAnimating: boolean;
  onRate: (rating: number) => void;
  onHover: (rating: number) => void;
  onLeave: () => void;
}

export interface SocialIconProps {
  type: string;
  url: string;
}

export interface StudentProfileProps {
  student: {
    id: string;
    name: string;
    description: string;
    avatar: string;
    rating: number;
    socialLinks: SocialLinkType[];
  };
  onEditProfile: () => void;
  onEditAvatar: () => void;
}