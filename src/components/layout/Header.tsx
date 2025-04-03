
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close mobile menu when tapping outside
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

  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Portfólio', path: '/portfolio' },
    { name: 'Depoimentos', path: '/depoimentos' },
    { name: 'Contato', path: '/contato' }
  ];

  // WhatsApp URL with pre-filled message
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento.";

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3 sm:py-4' : 'bg-transparent py-4 sm:py-6'
      )}
    >
      <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="relative z-10 flex items-center space-x-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="font-serif font-bold text-xl md:text-2xl tracking-tight">
            casa<span className="text-primary">branca</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
          <Button asChild size="sm">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Orçamento
            </a>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          data-mobile-trigger
          className="md:hidden relative z-10 p-2 -mr-2 text-foreground"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation with improved touch interaction */}
        <div
          data-mobile-menu
          className={cn(
            'fixed inset-0 bg-background/95 backdrop-blur-sm z-0 md:hidden transition-all duration-300',
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          <nav className="flex flex-col items-center justify-center h-full space-y-6 py-8 px-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-lg font-medium hover:text-primary transition-colors duration-200 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild className="w-full sm:w-auto mt-4">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setIsMenuOpen(false)}
              >
                Solicitar Orçamento
              </a>
            </Button>
            <Link 
              to="/admin" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-8"
              onClick={() => setIsMenuOpen(false)}
            >
              Área Administrativa
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
