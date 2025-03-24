
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(
      "space-y-2 mb-10",
      centered && "text-center mx-auto",
      className
    )}>
      <h2 className="text-3xl font-serif font-medium tracking-tight md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-[600px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
