export type SocialLinkType = {
  name: string;
  url: string;
};

export type ReviewType = {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
};

export type MentorProfileType = {
  id: string;
  username: string;
  name: string; 
  email?: string;
  description: string;
  avatarUrl: string;
  expertise: string;
  tags: string[];
  rating: number; 
  reviews: ReviewType[]; 
  links?: SocialLinkType[];
}