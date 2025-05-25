
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";

interface BlogHeaderProps {
  title: string;
  subtitle?: string;
  publishedAt: string;
  author?: string;
  readingTime?: number;
  category?: string;
  featured?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

export const BlogHeader = ({
  title,
  subtitle,
  publishedAt,
  author = "Casa Branca Reformas",
  readingTime,
  category,
  featured = false,
  imageUrl,
  imageAlt
}: BlogHeaderProps) => {
  const formattedDate = format(new Date(publishedAt), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <header className="relative mb-8">
      {imageUrl && (
        <div className="relative w-full h-64 md:h-96 mb-8 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {featured && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Destaque
              </Badge>
            </div>
          )}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        {category && (
          <Badge variant="outline" className="mb-4">
            {category}
          </Badge>
        )}
        
        <SectionHeading
          title={title}
          subtitle={subtitle}
          centered
          className="mb-6"
        />
        
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={publishedAt}>{formattedDate}</time>
          </div>
          
          {author && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
          )}
          
          {readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{readingTime} min de leitura</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
