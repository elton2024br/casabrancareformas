import { WhatsappLogo } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type FloatingActionButtonProps = {
  phoneNumber: string;
  message?: string;
  scrollThreshold?: number;
  className?: string;
};

export function FloatingActionButton({
  phoneNumber,
  message = "",
  scrollThreshold = 300,
  className,
}: FloatingActionButtonProps) {
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

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-all hover:scale-110 md:hidden z-40",
        className
      )}
      aria-label="Contato via WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" />
    </button>
  );
} 