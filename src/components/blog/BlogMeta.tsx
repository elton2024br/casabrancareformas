
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BlogMetaProps {
  tags?: string[];
  category?: string;
  lastModified?: string;
  wordCount?: number;
  className?: string;
}

export const BlogMeta = ({
  tags = [],
  category,
  lastModified,
  wordCount,
  className
}: BlogMetaProps) => {
  if (!tags.length && !category && !lastModified && !wordCount) {
    return null;
  }

  return (
    <aside className={className}>
      <Separator className="mb-6" />
      
      <div className="flex flex-wrap gap-4 items-center justify-center text-sm text-muted-foreground">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span>Tags:</span>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Word Count */}
        {wordCount && (
          <div className="flex items-center gap-1">
            <span>{wordCount.toLocaleString()} palavras</span>
          </div>
        )}

        {/* Last Modified */}
        {lastModified && (
          <div className="flex items-center gap-1">
            <span>Atualizado em {lastModified}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
