
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { SeoMeta } from "@/components/ui/seo-meta";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <>
      <SeoMeta 
        title="Página Não Encontrada | Casa Branca Reformas Ubatuba"
        description="A página que você está procurando não existe ou foi movida. Volte para a Casa Branca Reformas e encontre informações sobre construção civil em Ubatuba."
        noindex={true}
      />
      
      <MainLayout>
        <section className="flex flex-col items-center justify-center min-h-[80vh] py-16 px-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-serif font-medium mb-6">Página não encontrada</h2>
            <p className="text-muted-foreground mb-8">
              A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
            </p>
            <Button asChild>
              <Link to="/" className="inline-flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o início
              </Link>
            </Button>
          </div>
        </section>
      </MainLayout>
    </>
  );
};

export default NotFound;
