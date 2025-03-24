
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif font-bold text-xl tracking-tight">
                casa<span className="text-primary">branca</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Transformamos espaços com design minimalista e execução impecável, criando ambientes que refletem sua personalidade.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Links Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Início
              </Link>
              <Link to="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">
                Portfólio
              </Link>
              <Link to="/depoimentos" className="text-muted-foreground hover:text-foreground transition-colors">
                Depoimentos
              </Link>
              <Link to="/contato" className="text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </Link>
              <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                Área Administrativa
              </Link>
            </nav>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contato</h3>
            <div className="space-y-3">
              <a 
                href="mailto:contato@casabrancareformas.com" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={18} className="mr-2" />
                contato@casabrancareformas.com
              </a>
              <a 
                href="tel:+5511999999999" 
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone size={18} className="mr-2" />
                (11) 99999-9999
              </a>
              <div className="flex items-start text-muted-foreground">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>
                  Av. Paulista, 1000, Bela Vista<br />
                  São Paulo - SP, 01310-100
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Casa Branca Reformas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
