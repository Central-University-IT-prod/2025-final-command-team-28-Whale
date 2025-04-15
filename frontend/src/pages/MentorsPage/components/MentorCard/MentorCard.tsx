import { Card } from "@/components/ui/card";
import { Star, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useRef, useEffect } from "react";
import { RequestDialog } from "@/pages/MentorPage/components/RequestDialog/RequestDialog";
import { MentorProfileType } from "@/pages/MentorPage/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { gql, useQuery } from "@apollo/client";
import { useCookies } from "react-cookie";

interface MentorCardProps {
  mentor: MentorProfileType;
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

export const MentorCard = ({ mentor }: MentorCardProps) => {
  const navigate = useNavigate();
  const [isRequestOpened, setIsRequestOpened] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [wasModalInteraction, setWasModalInteraction] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [mentor.avatarUrl]);

  const renderAvatar = () => {
    const avatarSize = "w-16 h-16 rounded-full";
    const defaultAvatar = (
      <div
        className={cn(
          avatarSize,
          "bg-muted flex items-center justify-center",
          "border border-border"
        )}
      >
        <User className="w-8 h-8 text-muted-foreground" />
      </div>
    );

    if (!mentor.avatarUrl || avatarError) return defaultAvatar;

    return (
      <img
        src={mentor.avatarUrl}
        alt={`Аватар ${mentor.username}`}
        className={cn(
          avatarSize,
          "object-cover border border-border rounded-lg",
          "transition-opacity duration-150 hover:opacity-90"
        )}
        onError={() => setAvatarError(true)}
        loading="lazy"
      />
    );
  };

  console.log(mentor.rating)

  const handleCardClick = useCallback((evt: React.MouseEvent) => {
    if ((evt.target as HTMLElement).closest('button')) return;
    if (wasModalInteraction) return;
    navigate({ to: `/mentors/${mentor.id}` });
  }, [navigate, mentor.id, wasModalInteraction]);

  const handleRequestButton = useCallback((evt: React.MouseEvent) => {
    evt.stopPropagation();
    setIsRequestOpened(true);
  }, []);

  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsRequestOpened(open);
    if (!open) {
      setWasModalInteraction(true);
      setTimeout(() => setWasModalInteraction(false), 300);
    }
  }, []);

  const [cookies] = useCookies(["PROD_SESSION"]);

  const [role, setRole] = useState<"student" | "mentor" | undefined>();

  const { refetch } = useQuery(GET_CURRENT_USER);

  useEffect(() => {
    refetch().then((data) => {
      if (data.data.getCurrentUser.expetise) {
        setRole("mentor");
      } else {
        setRole("student");
      }
    });
  }, [cookies.PROD_SESSION]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            ref={cardRef}
            className="group hover:shadow-sm transition-shadow w-full cursor-pointer 
            bg-background border-border rounded-2xl"
            onClick={handleCardClick}
          >
            <div className="flex p-4 gap-4">
              <div className="flex-shrink-0">{renderAvatar()}</div>

              <div className="flex-grow flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium truncate max-w-[200px]">
                      {mentor.username || "Анонимный ментор"}
                    </h3>
                    {mentor.expertise && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="truncate max-w-[200px]">
                          {mentor.expertise}
                        </span>
                      </div>
                    )}
                  </div>

                  {mentor.rating !== undefined && (
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">
                        {mentor.rating === 0 ? "Нет оценок" : mentor.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {mentor.description || "Описание отсутствует"}
                </p>

                <div className="flex flex-wrap gap-2">
                  {mentor.tags?.length > 0 ? (
                    <>
                      {mentor.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                          font-medium bg-accent text-accent-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {mentor.tags.length > 3 && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs 
                          font-medium bg-accent text-acccent-foreground"
                        >
                          +{mentor.tags.length - 3}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Теги не указаны
                    </span>
                  )}
                </div>
                {role === "mentor" ? (
                  ""
                ) : (
                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="rounded-lg"
                      onClick={handleRequestButton}
                    >
                      Оставить заявку
                    </Button>
                    <RequestDialog
                      mentor={mentor}
                      isOpen={isRequestOpened}
                      onOpenChange={handleModalOpenChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TooltipTrigger>

        <TooltipContent
          className="bg-primary-foreground text-primary border-border"
          sideOffset={6}
        >
          <p>Открыть профиль</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
