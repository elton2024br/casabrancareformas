
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Play } from "lucide-react";

interface ProjectMetaProps {
  category: string;
  isVideo?: boolean;
  className?: string;
}

export const ProjectMeta = ({ category, isVideo = false, className }: ProjectMetaProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="secondary" className="flex items-center gap-1">
        <Tag className="h-3 w-3" />
        {category}
      </Badge>
      {isVideo && (
        <Badge variant="outline" className="flex items-center gap-1 text-primary">
          <Play className="h-3 w-3" />
          Vídeo
        </Badge>
      )}
      <Badge variant="outline" className="flex items-center gap-1">
        <Calendar className="h-3 w-3" />
        {new Date().toLocaleDateString()}
      </Badge>
    </div>
  );
};
