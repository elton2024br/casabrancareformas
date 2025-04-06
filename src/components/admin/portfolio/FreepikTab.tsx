
import { FreepikImageSelector } from "@/components/admin/FreepikImageSelector";
import { type FreepikTabProps } from "./formTypes";

export function FreepikTab({ category, imageUrl, onImageSelect }: FreepikTabProps) {
  return (
    <FreepikImageSelector
      onSelectImage={onImageSelect}
      initialQuery={category}
      selectedImage={imageUrl}
    />
  );
}
