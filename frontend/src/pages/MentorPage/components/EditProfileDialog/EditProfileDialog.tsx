import { useState } from "react";
import { X, Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MentorProfileType } from "../../types";


interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: MentorProfileType;
  onSave: (mentor: MentorProfileType) => void;
}

export const EditProfileDialog = ({ 
  isOpen, 
  onOpenChange, 
  mentor, 
  onSave 
}: EditProfileDialogProps) => {
  const [editableMentor, setEditableMentor] = useState<MentorProfileType>({ ...mentor });
  const [newTag, setNewTag] = useState<string>("");
  const [newSocialType, setNewSocialType] = useState<string>("github");
  const [newSocialUrl, setNewSocialUrl] = useState<string>("");

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setEditableMentor({ ...mentor });
      setNewTag("");
      setNewSocialType("github");
      setNewSocialUrl("");
    }
    onOpenChange(open);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setEditableMentor({
        ...editableMentor,
        tags: [...editableMentor.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setEditableMentor({
      ...editableMentor,
      tags: editableMentor.tags.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleAddSocialLink = () => {
    if (newSocialUrl.trim()) {
      const socialLinks = editableMentor.links || [];
      setEditableMentor({
        ...editableMentor,
        links: [
          ...socialLinks,
          { name: newSocialType, url: newSocialUrl.trim() },
        ],
      });
      setNewSocialUrl("");
    }
  };

  const handleRemoveSocialLink = (indexToRemove: number) => {
    if (editableMentor.links) {
      setEditableMentor({
        ...editableMentor,
        links: editableMentor.links.filter(
          (_, index) => index !== indexToRemove
        ),
      });
    }
  };

  const handleSave = () => {
    onSave(editableMentor);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактирование профиля</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={editableMentor.name}
              onChange={(e) =>
                setEditableMentor({
                  ...editableMentor,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={editableMentor.description}
              onChange={(e) =>
                setEditableMentor({
                  ...editableMentor,
                  description: e.target.value,
                })
              }
              className="min-h-[100px]"
            />
          </div>

          <TagsEditor 
            tags={editableMentor.tags}
            newTag={newTag}
            onNewTagChange={setNewTag}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
          
          <SocialLinksEditor 
            socialLinks={editableMentor.links || []}
            newSocialType={newSocialType}
            newSocialUrl={newSocialUrl}
            onNewSocialTypeChange={setNewSocialType}
            onNewSocialUrlChange={setNewSocialUrl}
            onAddSocialLink={handleAddSocialLink}
            onRemoveSocialLink={handleRemoveSocialLink}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            type="button"
          >
            Отмена
          </Button>
          <Button onClick={handleSave} type="button">
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface TagsEditorProps {
  tags: string[];
  newTag: string;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
}

const TagsEditor = ({ 
  tags, 
  newTag, 
  onNewTagChange, 
  onAddTag, 
  onRemoveTag 
}: TagsEditorProps) => {
  return (
    <div className="space-y-2">
      <Label>Теги</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(index)}
              className="text-primary hover:text-red-500 transition-colors"
              type="button"
              aria-label="Удалить тег"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Новый тег"
          value={newTag}
          onChange={(e) => onNewTagChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddTag();
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onAddTag}
          disabled={!newTag.trim()}
          type="button"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};


interface SocialLinksEditorProps {
  socialLinks: Array<{ type: string; url: string }>;
  newSocialType: string;
  newSocialUrl: string;
  onNewSocialTypeChange: (value: string) => void;
  onNewSocialUrlChange: (value: string) => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (index: number) => void;
}

const SocialLinksEditor = ({
  socialLinks,
  newSocialType,
  newSocialUrl,
  onNewSocialTypeChange,
  onNewSocialUrlChange,
  onAddSocialLink,
  onRemoveSocialLink
}: SocialLinksEditorProps) => {
  return (
    <div className="space-y-2">
      <Label>Социальные сети</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {socialLinks.map((social, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {social.type}: {social.url.substring(0, 20)}...
            <button
              onClick={() => onRemoveSocialLink(index)}
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
          onChange={(e) => onNewSocialTypeChange(e.target.value)}
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
          onChange={(e) => onNewSocialUrlChange(e.target.value)}
          className="w-2/3"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddSocialLink();
            }
          }}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onAddSocialLink}
          disabled={!newSocialUrl.trim()}
          type="button"
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};