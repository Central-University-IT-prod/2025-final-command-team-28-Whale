export type QuestionStatus = 'pending' | 'active' | 'rejected' | 'completed';
export type TabValue = QuestionStatus | 'all';

export interface SocialLink {
  type: string;
  url: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  socialLinks: SocialLink[];
}

export interface QuestionRequest {
  id: string;
  user: User;
  question: string;
  status: QuestionStatus;
  timestamp: Date;
}