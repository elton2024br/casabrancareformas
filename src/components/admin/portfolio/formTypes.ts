
import { type Project } from "@/components/ui/project-card";

export interface ProjectFormProps {
  project: Project;
  isAddMode: boolean;
  onSubmit: (project: Project) => void;
  onCancel: () => void;
}

export interface ImageUploaderProps {
  imageUrl: string | null;
  onImageSelect: (imageUrl: string) => void;
  clearImage: () => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  activeTab: string;
}

export interface FreepikTabProps {
  category: string;
  imageUrl: string;
  onImageSelect: (imageUrl: string) => void;
}
