
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import MobileMenuTrigger from './navigation/MobileMenuTrigger';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar menu quando navegar ou pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    const handleRouteChange = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('popstate', handleRouteChange);
      // Prevenir scroll do body quando menu estiver aberto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handleRouteChange);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Fechar menu quando clicar fora (simplificado)
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-mobile-menu]') && !target.closest('[data-mobile-trigger]')) {
        setIsMenuOpen(false);
      }
    };

    // Pequeno delay para evitar fechar imediatamente após abrir
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

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
          isTouch={false}
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
