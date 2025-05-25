
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import MobileMenuTrigger from './navigation/MobileMenuTrigger';

// Estilos CSS específicos para mobile
const mobileStyles = `
  @media (hover: none) {
    .tap-highlight-transparent {
      -webkit-tap-highlight-color: transparent;
    }
    
    .touch-manipulation {
      touch-action: manipulation;
    }
  }
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu ao navegar para outra rota
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [isMenuOpen]);

  // Injetar estilos CSS mobile no head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mobileStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Verificar se é dispositivo touch
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Fechar menu quando toca fora
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMenuOpen && !target.closest('[data-mobile-menu]') && !target.closest('[data-mobile-trigger]')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleCloseMenu = () => setIsMenuOpen(false);

  const handleItemHover = (path: string) => {
    setActiveItem(path);
  };

  const handleItemLeave = () => {
    setActiveItem(null);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2 sm:py-3' : 'bg-transparent py-4 sm:py-5'
      )}
    >
      <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="relative z-10 flex items-center space-x-2"
          onClick={handleCloseMenu}
        >
          <span className="font-serif font-bold text-xl md:text-2xl tracking-tight">
            casa<span className="text-primary">branca</span>
          </span>
        </Link>

        <DesktopNavigation 
          activeItem={activeItem}
          onItemHover={handleItemHover}
          onItemLeave={handleItemLeave}
          isTouch={isTouch}
        />

        <MobileMenuTrigger 
          isMenuOpen={isMenuOpen}
          onToggle={toggleMenu}
        />

        <MobileMenu 
          isMenuOpen={isMenuOpen}
          onClose={handleCloseMenu}
        />
      </div>
    </header>
  );
};

export default Header;
