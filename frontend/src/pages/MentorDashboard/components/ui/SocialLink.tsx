import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  MessageSquare,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

interface SocialLinkProps {
  type: string;
  url: string;
}

export const SocialLink = ({ type, url }: SocialLinkProps) => {
  const openLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderIcon = () => {
    switch (type) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'youtube':
        return <Youtube className="h-4 w-4" />;
      case 'website':
        return <Globe className="h-4 w-4" />;
      case 'telegram':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openLink}
      className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:scale-110"
      title={`${type.charAt(0).toUpperCase() + type.slice(1)}`}
    >
      {renderIcon()}
    </Button>
  );
};