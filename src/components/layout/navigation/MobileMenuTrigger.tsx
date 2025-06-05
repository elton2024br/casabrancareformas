
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
      className="md:hidden relative z-[70] p-2 text-foreground rounded-md hover:bg-muted/50 transition-colors duration-200 active:scale-95"
      onClick={onToggle}
      aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
      aria-expanded={isMenuOpen}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Menu 
          size={24} 
          className={`absolute transition-all duration-200 ${
            isMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
          }`} 
        />
        <X 
          size={24} 
          className={`absolute transition-all duration-200 ${
            isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
          }`} 
        />
      </div>
    </button>
  );
};

export default MobileMenuTrigger;
