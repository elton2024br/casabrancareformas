
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  imageUrl?: string;
  content: string;
  rating?: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      {/* Rating */}
      {testimonial.rating && (
        <div className="mb-4 flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn(
                "h-5 w-5",
                i < testimonial.rating! ? "text-primary fill-primary" : "text-muted stroke-muted"
              )}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      )}

      {/* Content */}
      <blockquote className="flex-1">
        <p className="text-card-foreground leading-relaxed">"{testimonial.content}"</p>
      </blockquote>

      {/* Client */}
      <div className="mt-6 flex items-center">
        {testimonial.imageUrl && (
          <img
            src={testimonial.imageUrl}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full object-cover mr-3"
          />
        )}
        <div>
          <p className="font-medium text-card-foreground">{testimonial.name}</p>
          {(testimonial.role || testimonial.company) && (
            <p className="text-sm text-muted-foreground">
              {testimonial.role}
              {testimonial.role && testimonial.company && ", "}
              {testimonial.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
