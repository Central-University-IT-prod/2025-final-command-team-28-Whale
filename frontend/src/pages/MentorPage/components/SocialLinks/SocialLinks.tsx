import { SocialLinkType } from "../../types";
import { SocialIcon } from "./SocialIcon";

interface SocialLinksProps {
  socialLinks?: SocialLinkType[];
}

export const SocialLinks = ({ socialLinks }: SocialLinksProps) => {
  if (!socialLinks || socialLinks.length === 0) return null;
  
  return (
    <div className="flex items-center gap-3 mb-4 mt-2">
      {socialLinks.map((social, index) => (
        <SocialIcon key={index} type={social.name} url={social.url} />
      ))}
    </div>
  );
};