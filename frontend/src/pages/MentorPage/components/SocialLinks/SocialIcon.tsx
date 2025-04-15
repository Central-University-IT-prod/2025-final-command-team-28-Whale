import { Github, Twitter, Linkedin, Send, Instagram, Youtube, Globe } from "lucide-react";

interface SocialIconProps {
  type: string;
  url: string;
}

export const SocialIcon = ({ type, url }: SocialIconProps) => {
  const getIcon = () => {
    switch (type.toLowerCase()) {
      case "github":
        return <Github size={20} />;
      case "twitter":
        return <Twitter size={20} />;
      case "linkedin":
        return <Linkedin size={20} />;
      case "telegram":
        return <Send size={20} />;
      case "instagram":
        return <Instagram size={20} />;
      case "youtube":
        return <Youtube size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  const getColor = () => {
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

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        flex items-center justify-center w-10 h-10 rounded-full 
        bg-muted transition-all duration-300 
        hover:text-white ${getColor()} 
        transform hover:-translate-y-1 hover:shadow-md
      `}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
    >
      {getIcon()}
    </a>
  );
};