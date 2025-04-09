import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

  // Itens do menu com melhor estrutura para versão mobile
  const navItems = [
    { name: 'Início', path: '/', icon: 'home' },
    { name: 'Sobre', path: '/sobre', icon: 'info' },
    { name: 'Portfólio', path: '/portfolio', icon: 'image' },
    { name: 'Depoimentos', path: '/depoimentos', icon: 'message-circle' },
    { name: 'Contato', path: '/contato', icon: 'mail' },
    { name: 'Blog', path: '/blog', icon: 'book' }
  ];

  // WhatsApp URL com mensagem pré-preenchida
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento.";

  // Verificar se é dispositivo touch
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Define o item ativo no hover para dispositivos não-touch
  const handleItemHover = (path: string) => {
    if (!isTouch) {
      setActiveItem(path);
    }
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
              onMouseEnter={() => handleItemHover(item.path)}
              onMouseLeave={() => setActiveItem(null)}
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

        {/* Mobile Menu Button com área de toque maior */}
        <button
          data-mobile-trigger
          className="md:hidden relative z-[60] p-3 -mr-3 text-foreground rounded-full hover:bg-muted/50 active:bg-muted/80 transition-colors tap-highlight-transparent touch-manipulation"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation aprimorada */}
        <div
          data-mobile-menu
          className={cn(
            'fixed inset-0 bg-background/95 backdrop-blur-sm z-[55] md:hidden transition-all duration-300',
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          <nav className="flex flex-col items-start justify-center h-full py-8 px-6 space-y-1 max-w-md mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-lg font-medium w-full py-4 px-4 rounded-lg flex items-center justify-between transition-colors duration-200",
                  "active:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/40",
                  "touch-manipulation tap-highlight-transparent",
                  window.location.pathname === item.path 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "hover:bg-muted/50"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.name}</span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </Link>
            ))}
            
            {/* Botão CTA para WhatsApp com ícone de telefone */}
            <div className="w-full pt-4 mt-4 border-t border-muted">
              <Button asChild className="w-full py-6 text-base touch-manipulation" size="lg">
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  <span>Solicitar Orçamento</span>
                </a>
              </Button>
            </div>
            
            {/* Link para área administrativa com toque ampliado */}
            <div className="w-full flex justify-center mt-4 pt-6">
              <Link 
                to="/admin" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-3 px-4 touch-manipulation"
                onClick={() => setIsMenuOpen(false)}
              >
                Área Administrativa
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
