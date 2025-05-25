
import { cn } from "@/lib/utils";

interface BlogContentProps {
  content: string;
  className?: string;
}

export const BlogContent = ({ content, className }: BlogContentProps) => {
  return (
    <article 
      className={cn(
        "prose prose-lg max-w-4xl mx-auto",
        "prose-headings:font-serif prose-headings:text-foreground",
        "prose-p:text-muted-foreground prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-blockquote:border-l-primary prose-blockquote:bg-secondary/50",
        "prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-secondary prose-pre:border",
        "prose-img:rounded-lg prose-img:shadow-md",
        "prose-hr:border-border",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
