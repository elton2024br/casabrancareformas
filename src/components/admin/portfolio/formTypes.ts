
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
  onVideoSelect?: (videoUrl: string) => void;
  videoUrl?: string | null;
  isVideo?: boolean;
  setIsVideo?: (value: boolean) => void;
}

export interface FreepikTabProps {
  category: string;
  imageUrl: string;
  onImageSelect: (imageUrl: string) => void;
}

export interface VideoUploaderProps {
  videoUrl: string | null;
  onVideoSelect: (videoUrl: string) => void;
  clearVideo: () => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
}
