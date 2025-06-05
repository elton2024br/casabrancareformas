
import { Link } from 'react-router-dom';
import { Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { navItems, whatsappUrl } from './NavItems';

interface MobileMenuProps {
  isMenuOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isMenuOpen, onClose }: MobileMenuProps) => {
  return (
    <div
      data-mobile-menu
      className={cn(
        'fixed inset-0 bg-background/95 backdrop-blur-sm z-[65] md:hidden transition-all duration-300 ease-in-out',
        isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
    >
      <nav className="flex flex-col items-start justify-center h-full py-8 px-6 space-y-1 max-w-md mx-auto">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "text-lg font-medium w-full py-4 px-4 rounded-lg flex items-center justify-between transition-all duration-200",
              "hover:bg-muted/50 active:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40",
              "transform transition-transform",
              isMenuOpen ? `translate-x-0 opacity-100` : `translate-x-4 opacity-0`,
              window.location.pathname === item.path 
                ? "bg-primary/10 text-primary font-semibold" 
                : ""
            )}
            style={{ 
              transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms' 
            }}
            onClick={onClose}
          >
            <span>{item.name}</span>
            <ChevronRight size={18} className="text-muted-foreground" />
          </Link>
        ))}
        
        <div className={cn(
          "w-full pt-4 mt-4 border-t border-muted transition-all duration-300",
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
        )}
        style={{ 
          transitionDelay: isMenuOpen ? `${navItems.length * 50}ms` : '0ms' 
        }}>
          <Button asChild className="w-full py-6 text-base" size="lg">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={onClose}
              className="flex items-center justify-center gap-2"
            >
              <Phone size={18} />
              <span>Solicitar Orçamento</span>
            </a>
          </Button>
        </div>
        
        <div className={cn(
          "w-full flex justify-center mt-4 pt-6 transition-all duration-300",
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
        )}
        style={{ 
          transitionDelay: isMenuOpen ? `${(navItems.length + 1) * 50}ms` : '0ms' 
        }}>
          <Link 
            to="/admin" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors py-3 px-4"
            onClick={onClose}
          >
            Área Administrativa
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
