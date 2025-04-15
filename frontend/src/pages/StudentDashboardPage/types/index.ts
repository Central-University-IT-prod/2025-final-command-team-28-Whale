import { SocialLinkType } from "@/pages/MentorPage/types";

export interface MentorRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  status: 'active' | 'pending' | 'rejected';
  errorDescription: string;
  mentorLinks: SocialLinkType[];
}