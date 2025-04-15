import { SocialLinkType } from "../types";

export const parseSocialLinks = (links: any): SocialLinkType[] => {
  if (!links) return [];
  
  if (Array.isArray(links)) {
    return links.map(link => ({
      type: link.type,
      url: typeof link.url === 'string' ? link.url : String(link.url)
    }));
  }
  
  return Object.entries(links).map(([type, url]) => ({ 
    type, 
    url: typeof url === 'string' ? url : String(url) 
  }));
};

export const getSocialMediaColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "github":
      return "hover:bg-gray-800";
    case "twitter":
      return "hover:bg-blue-400";
    case "linkedin":
      return "hover:bg-blue-600";
    case "telegram":
      return "hover:bg-blue-500";
    case "instagram":
      return "hover:bg-pink-600";
    case "youtube":
      return "hover:bg-red-600";
    default:
      return "hover:bg-primary";
  }
};