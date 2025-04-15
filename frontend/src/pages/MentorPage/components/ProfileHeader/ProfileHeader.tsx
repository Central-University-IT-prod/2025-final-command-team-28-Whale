import { User, Camera } from "lucide-react";

interface ProfileHeaderProps {
  avatar: string;
  name: string;
  onAvatarClick: () => void;
}

export const ProfileHeader = ({ 
  avatar, 
  name, 
  onAvatarClick 
}: ProfileHeaderProps) => {
  return (
    <div className="mb-6 relative group">
      <div
        className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg border-4 border-primary/10 cursor-pointer"
        onClick={onAvatarClick}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="text-white" size={24} />
        </div>
      </div>
    </div>
  );
};