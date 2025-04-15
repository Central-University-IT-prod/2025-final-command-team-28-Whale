import { useRef, useState, useEffect } from "react";
import { Camera, User, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MentorProfileType } from "../../types";


interface EditAvatarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mentor: MentorProfileType;
  onSave: (mentor: MentorProfileType) => void;
}

export const EditAvatarDialog = ({ 
  isOpen, 
  onOpenChange, 
  mentor, 
  onSave 
}: EditAvatarDialogProps) => {
  const [editableMentor, setEditableMentor] = useState<MentorProfileType>({ ...mentor });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setEditableMentor({ ...mentor });
    }
  }, [isOpen, mentor]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditableMentor({
            ...editableMentor,
            avatar: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editableMentor);
  };

  const handleCancel = () => {
    setEditableMentor({ ...mentor });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Изменение аватара</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary/10">
            {editableMentor.avatar ? (
              <img
                src={editableMentor.avatar}
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
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          {editableMentor.avatar && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setEditableMentor({
                  ...editableMentor,
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
            onClick={handleCancel}
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