import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ScrollToTopProps = {
  scrollThreshold?: number;
  className?: string;
};

export function ScrollToTop({
  scrollThreshold = 300,
  className,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > scrollThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 text-white shadow-lg transition-all hover:bg-primary hover:scale-110 md:bottom-8 md:right-8 z-40",
        className
      )}
      aria-label="Voltar ao topo"
    >
      <ArrowUp size={20} />
    </button>
  );
} 