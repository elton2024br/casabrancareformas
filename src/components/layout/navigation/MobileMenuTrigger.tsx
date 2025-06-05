
import { Menu, X } from 'lucide-react';

interface MobileMenuTriggerProps {
  isMenuOpen: boolean;
  onToggle: () => void;
}

const MobileMenuTrigger = ({ isMenuOpen, onToggle }: MobileMenuTriggerProps) => {
  return (
    <button
      type="button"
      data-mobile-trigger
      className="md:hidden relative z-[60] p-3 -mr-3 text-foreground rounded-full hover:bg-muted/50 active:bg-muted/80 transition-colors tap-highlight-transparent touch-manipulation"
      onClick={onToggle}
      aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
    >
      {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default MobileMenuTrigger;
