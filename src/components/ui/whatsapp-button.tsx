import { WhatsappLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface WhatsAppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  phoneNumber: string;
  message?: string;
  className?: string;
  iconSize?: number;
  showText?: boolean;
  text?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Olá! Gostaria de um orçamento para meu projeto.",
  className,
  iconSize = 24,
  showText = false,
  text = "Fale pelo WhatsApp",
  ...props
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md bg-whatsapp px-4 py-2 text-white shadow-md transition-all hover:bg-whatsapp/90",
        className
      )}
      aria-label="Contato via WhatsApp"
      {...props}
    >
      <WhatsappLogo size={iconSize} weight="fill" />
      {showText && <span>{text}</span>}
    </button>
  );
} 