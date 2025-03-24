
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  function SectionHeading({ title, subtitle, centered = false, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-2 mb-10",
          centered && "text-center mx-auto",
          className
        )}
      >
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
);
