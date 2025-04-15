import { useState, useRef } from "react";
import { EditableStudentProfile } from "../types";
import { parseSocialLinks } from "../utils/socialMediaUtils";

export const useProfileEdit = (initialStudentData: any) => {
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState<boolean>(false);
  const [editableStudent, setEditableStudent] = useState<EditableStudentProfile | null>(null);
  const [newSocialType, setNewSocialType] = useState<string>("github");
  const [newSocialUrl, setNewSocialUrl] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartEditingProfile = () => {
    if (initialStudentData) {
      setEditableStudent({
        id: initialStudentData.id,
        name: initialStudentData.username,
        description: initialStudentData.description || "",
        avatar: initialStudentData.avatarUrl || "",
        rating: initialStudentData.rating || 0,
        links: parseSocialLinks(initialStudentData.links)
      });
      setIsEditingProfile(true);
    }
  };

  const handleCancelEditingProfile = () => {
    setIsEditingProfile(false);
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", editableStudent);
    setIsEditingProfile(false);
  };

  const handleAvatarClick = () => {
    setIsEditingAvatar(true);
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

  const handleSaveAvatar = () => {
    console.log("Saving avatar:", editableStudent?.avatar);
    setIsEditingAvatar(false);
  };

  const handleAddSocialLink = () => {
    if (newSocialUrl.trim() && editableStudent) {
      const links = editableStudent.links || [];
      setEditableStudent({
        ...editableStudent,
        links: [
          ...links,
          { type: newSocialType, url: newSocialUrl.trim() },
        ],
      });
      setNewSocialUrl("");
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

  return {
    isEditingProfile,
    isEditingAvatar,
    editableStudent,
    newSocialType,
    newSocialUrl,
    fileInputRef,
    setIsEditingProfile,
    setIsEditingAvatar,
    setNewSocialType,
    setNewSocialUrl,
    handleStartEditingProfile,
    handleCancelEditingProfile,
    handleSaveProfile,
    handleAvatarClick,
    handleFileSelect,
    handleSaveAvatar,
    handleAddSocialLink,
    handleRemoveSocialLink
  };
};