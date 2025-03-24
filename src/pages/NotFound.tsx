
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center bg-secondary">
        <div className="text-center px-4 animate-fade-in">
          <h1 className="text-7xl font-bold mb-6">404</h1>
          <p className="text-2xl font-medium mb-6">Página não encontrada</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            A página que você está procurando não existe ou foi removida.
          </p>
          <Button asChild size="lg">
            <Link to="/">Voltar para a Página Inicial</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
