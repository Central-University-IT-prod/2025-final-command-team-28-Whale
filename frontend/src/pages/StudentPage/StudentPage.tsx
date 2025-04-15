import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Star,
  StarHalf,
  User,
  Edit,
  Camera,
  X,
  Plus,
  Trash2,
  Github,
  Twitter,
  Linkedin,
  Send,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useCallback, useRef, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { SocialLinkType } from "../MentorPage/types";

export type Student = {
  id: string;
  username: string;
  email: string;
  links?: SocialLinkType[] | null;
  avatarUrl?: string | null;
  description?: string | null;
  rating?: number;
};

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

const GET_STUDENT_BY_ID = gql`
  query GetStudentById($id: UUID!) {
    getStudentById(id: $id) {
      id
      username
      email
      links
      avatarUrl
      description
    }
  }
`;

const EDIT_STUDENT = gql`
  mutation EditStudent(
    $id: UUID!
    $username: String
    $email: String
    $avatarUrl: String
    $description: String
    $links: JSON
  ) {
    editStudent(
      input: {
        id: $id
        username: $username
        email: $email
        avatarUrl: $avatarUrl
        description: $description
        links: $links
      }
    ) {
      id
      username
      email
      avatarUrl
      description
      links
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($studentId: UUID!, $stars: Int!) {
    createReviewOnUser(input: { studentId: $studentId, stars: $stars }) {
      stars
    }
  }
`;

interface RatingStarProps {
  index: number;
  rating: number;
  hoverRating: number;
  isAnimating: boolean;
  onRate: (rating: number) => void;
  onHover: (rating: number) => void;
  onLeave: () => void;
}

const RatingStar: React.FC<RatingStarProps> = ({
  index,
  rating,
  hoverRating,
  isAnimating,
  onRate,
  onHover,
  onLeave,
}) => {
  const isActive =
    hoverRating > 0 ? index + 1 <= hoverRating : index + 1 <= rating;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => onHover(index + 1)}
      onMouseLeave={onLeave}
      onClick={() => onRate(index + 1)}
    >
      <Star
        size={24}
        className={`
          cursor-pointer
          transition-all duration-300 ease-out
          ${isAnimating && index + 1 <= rating ? "animate-pop" : ""}
          transform ${isActive ? "scale-110" : "scale-100"}
          ${isActive ? "text-amber-500" : "text-muted-foreground"}
        `}
        fill={isActive ? "currentColor" : "none"}
        strokeWidth={isActive ? 1.5 : 2}
      />
      {isActive && (
        <span
          className="absolute inset-0 animate-pulse-subtle rounded-full bg-amber-400/20"
          style={{ animationDelay: `${index * 50}ms` }}
        />
      )}
    </div>
  );
};

interface SocialIconProps {
  type: string;
  url: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ type, url }) => {
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

interface EditableStudentProfile {
  id: string;
  username: string;
  email: string;
  description: string;
  avatar: string;
  rating: number;
  links: Array<{ name: string; url: string }> | null;
}

const StudentPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams({ from: "/students/$studentId" });

  const { loading, error, data, refetch } = useQuery(GET_STUDENT_BY_ID, {
    variables: { id: studentId },
  });

  const [createReview] = useMutation(CREATE_REVIEW);

  const { loading: currentLoading, data: currentData } =
    useQuery(GET_CURRENT_USER);

  const [editStudent, { loading: editLoading }] = useMutation(EDIT_STUDENT);

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [animatingStars, setAnimatingStars] = useState<boolean>(false);

  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);
  const [editableStudent, setEditableStudent] =
    useState<EditableStudentProfile | null>(null);

  const [newSocialType, setNewSocialType] = useState<string>("github");
  const [newSocialUrl, setNewSocialUrl] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.getStudentById?.rating) {
      setRating(data.getStudentById.rating);
    }
  }, [data]);

  const handleRatingClick = useCallback(
    (newRating: number) => {
      setAnimatingStars(true);

      if (newRating === rating) {
        setTimeout(() => {
          setRating(0);
          setAnimatingStars(false);
        }, 300);
      } else {
        setTimeout(() => {
          setRating(newRating);
          setAnimatingStars(false);
        }, 300);
      }
    },
    [rating]
  );

  const handleStartEditingProfile = () => {
    if (data?.getStudentById) {
      const student = data.getStudentById;
      let formattedLinks = [];

      if (student.links) {
        if (Array.isArray(student.links)) {
          formattedLinks = student.links
            .map((link: any) => {
              if (typeof link === "object") {
                if (link.name && link.url) {
                  return { name: link.name, url: link.url };
                } else {
                  const name = Object.keys(link)[0];
                  return { name, url: String(link[name]) };
                }
              }
              return null;
            })
            .filter(Boolean);
        } else if (typeof student.links === "object") {
          formattedLinks = Object.entries(student.links).map(([name, url]) => ({
            name,
            url: typeof url === "string" ? url : String(url),
          }));
        }
      }

      setEditableStudent({
        id: student.id,
        username: student.username,
        email: student.email,
        description: student.description || "",
        avatar: student.avatarUrl || "",
        rating: student.rating || 0,
        links: formattedLinks,
      });
      setIsEditingProfile(true);
    }
  };

  const handleCancelEditingProfile = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = async () => {
    if (!editableStudent) return;

    try {
      const linksArray = editableStudent.links || [];

      await editStudent({
        variables: {
          id: editableStudent.id,
          username: editableStudent.username,
          email: editableStudent.email,
          description: editableStudent.description,
          avatarUrl: editableStudent.avatar,
          links: linksArray,
        },
      });

      await refetch();
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleAvatarClick = () => {
    if (editableStudent) {
      setIsEditingAvatar(true);
    } else {
      handleStartEditingProfile();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editableStudent) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && editableStudent) {
          setEditableStudent({
            ...editableStudent,
            avatar: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!editableStudent) return;

    try {
      await editStudent({
        variables: {
          id: editableStudent.id,
          avatarUrl: editableStudent.avatar,
        },
      });

      await refetch();
      setIsEditingAvatar(false);
    } catch (error) {
      console.error("Error saving avatar:", error);
    }
  };

  const handleAddSocialLink = () => {
    if (newSocialUrl.trim() && editableStudent) {
      const links = editableStudent.links || [];
      const newLink = { name: newSocialType, url: newSocialUrl.trim() };

      const updatedLinks = [...links, newLink];

      setEditableStudent({
        ...editableStudent,
        links: updatedLinks,
      });

      setNewSocialUrl("");

      console.log("Добавлена ссылка:", newLink);
      console.log("Новый массив ссылок будет:", updatedLinks);
    }
  };

  const handleRemoveSocialLink = (indexToRemove: number) => {
    if (editableStudent && editableStudent.links) {
      setEditableStudent({
        ...editableStudent,
        links: editableStudent.links.filter(
          (_, index) => index !== indexToRemove
        ),
      });
    }
  };

  if (loading)
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 flex justify-center">
        Загрузка...
      </div>
    );
  if (error)
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8 text-red-500">
        Ошибка: {error.message}
      </div>
    );
  if (!data?.getStudentById)
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        Студент не найден
      </div>
    );

  const studentData = data.getStudentById;

  const student = {
    id: studentData.id,
    username: studentData.username,
    email: studentData.email,
    description: studentData.description || "Описание отсутствует",
    avatar: studentData.avatarUrl || "",
    rating: studentData.rating || 0,
    links: studentData.links || [],
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-12 relative">
        <span className="absolute left-10">Студент</span>
        {!currentLoading &&
        currentData &&
        student.id === currentData.getCurrentUser.id ? (
          <Button
            variant="outline"
            size="sm"
            className="absolute -top-10 lg:top-0 lg:right-0 flex items-center gap-1"
            onClick={handleStartEditingProfile}
          >
            <Edit size={16} />
            <span>Редактировать профиль</span>
          </Button>
        ) : (
          ""
        )}
        <div className="mb-6 relative group">
          <div
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg border-4 border-primary/10 cursor-pointer"
            onClick={handleAvatarClick}
          >
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.username}
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
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        {Array.isArray(student.links) && (
          <div className="flex items-center gap-3 mb-4 mt-2">
            {student.links.map(
              (link: { name: string; url: string }, index: number) => (
                <SocialIcon
                  key={index}
                  type={link.name}
                  url={String(link.url)}
                />
              )
            )}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">
          {student.username}
        </h1>
        <p className="text-muted-foreground text-center max-w-xl mb-6">
          {student.description}
        </p>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-amber-500 mb-1">
            {new Array(Math.floor(Math.floor(student.rating / 0.5) / 2))
              .fill(0)
              .map((_k, i) => (
                <Star key={i} fill="currentColor" size={20} />
              ))}
            {new Array(Math.floor(student.rating / 0.5) % 2)
              .fill(0)
              .map((_k, i) => (
                <StarHalf key={i} fill="currentColor" size={20} />
              ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Рейтинг: {student.rating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="bg-card rounded-xl p-6 shadow-sm mb-8 border">
        <h2 className="text-xl font-semibold mb-4">Оставить отзыв</h2>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-3">
            {new Array(5).fill(0).map((_k, i) => (
              <RatingStar
                key={i}
                index={i}
                rating={rating}
                hoverRating={hoverRating}
                isAnimating={animatingStars}
                onRate={handleRatingClick}
                onHover={setHoverRating}
                onLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2 transition-all duration-300 min-w-[60px]">
            {hoverRating > 0
              ? `${hoverRating} из 5`
              : rating > 0
              ? `${rating} из 5`
              : "0 из 5"}
          </span>
        </div>
        <Button
          className="w-full sm:w-auto text-white transition-all duration-300 ease-in-out hover:shadow-md"
          disabled={rating === 0}
          onClick={() => {
            createReview({
              variables: {
                studentId: student.id,
                stars: rating,
              },
            }).then(() => {
              navigate({
                to: ".",
              });
            });
          }}
        >
          Опубликовать отзыв
        </Button>
      </div>
      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактирование профиля</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={editableStudent?.username || ""}
                onChange={(e) =>
                  editableStudent &&
                  setEditableStudent({
                    ...editableStudent,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editableStudent?.email || ""}
                onChange={(e) =>
                  editableStudent &&
                  setEditableStudent({
                    ...editableStudent,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={editableStudent?.description || ""}
                onChange={(e) =>
                  editableStudent &&
                  setEditableStudent({
                    ...editableStudent,
                    description: e.target.value,
                  })
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Социальные сети</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editableStudent?.links || []).map((social, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {social.name}: {social.url.substring(0, 20)}...
                    <button
                      onClick={() => handleRemoveSocialLink(index)}
                      className="text-primary hover:text-red-500 transition-colors"
                      type="button"
                      aria-label="Удалить соцсеть"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <select
                  className="flex h-10 w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newSocialType}
                  onChange={(e) => setNewSocialType(e.target.value)}
                >
                  <option value="github">GitHub</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="telegram">Telegram</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="website">Website</option>
                </select>
                <Input
                  placeholder="URL профиля"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  className="w-2/3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSocialLink();
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSocialLink}
                  disabled={!newSocialUrl.trim()}
                  type="button"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleCancelEditingProfile}
              type="button"
              disabled={editLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveProfile}
              type="button"
              disabled={editLoading}
            >
              {editLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditingAvatar} onOpenChange={setIsEditingAvatar}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Изменение аватара</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/10">
              {editableStudent?.avatar ? (
                <img
                  src={editableStudent.avatar}
                  alt="Предпросмотр аватара"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
              type="button"
            >
              <Camera size={16} />
              <span>Выбрать изображение</span>
            </Button>

            {editableStudent?.avatar && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  editableStudent &&
                  setEditableStudent({
                    ...editableStudent,
                    avatar: "",
                  })
                }
                className="flex items-center gap-2"
                type="button"
              >
                <Trash2 size={16} />
                <span>Удалить аватар</span>
              </Button>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingAvatar(false);
              }}
              type="button"
              disabled={editLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleSaveAvatar}
              type="button"
              disabled={editLoading}
            >
              {editLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentPage;
