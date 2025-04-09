import { WhatsappLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  showOnMobile?: boolean;
}

export function FloatingWhatsAppButton({
  phoneNumber,
  message = "",
  className,
  position = "bottom-right",
  showOnMobile = true,
}: FloatingWhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
    window.open(url, "_blank");
  };

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "fixed z-50 flex items-center justify-center rounded-full bg-whatsapp p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-whatsapp/90 focus:outline-none focus:ring-2 focus:ring-whatsapp/50",
        positionClasses[position],
        !showOnMobile && "hidden md:flex",
        className
      )}
      aria-label="Enviar mensagem via WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" />
      <span className="sr-only">WhatsApp</span>
    </button>
  );
} 