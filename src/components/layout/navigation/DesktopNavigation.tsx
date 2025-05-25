
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { navItems, whatsappUrl } from './NavItems';

interface DesktopNavigationProps {
  activeItem: string | null;
  onItemHover: (path: string) => void;
  onItemLeave: () => void;
  isTouch: boolean;
}

const DesktopNavigation = ({ 
  activeItem, 
  onItemHover, 
  onItemLeave, 
  isTouch 
}: DesktopNavigationProps) => {
  const handleItemHover = (path: string) => {
    if (!isTouch) {
      onItemHover(path);
    }
  };

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
          onMouseEnter={() => handleItemHover(item.path)}
          onMouseLeave={onItemLeave}
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
  );
};

export default DesktopNavigation;
