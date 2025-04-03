
import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SeoMeta } from "@/components/ui/seo-meta";

export function NotFoundProject() {
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento%20para%20meu%20projeto.";
  
  return (
    <>
      <SeoMeta 
        title="Projeto não encontrado | Casa Branca Reformas"
        description="O projeto que você está procurando não foi encontrado. Conheça outros projetos do nosso portfólio ou solicite um orçamento personalizado."
        noindex={true}
      />
      <Header />
      <div className="container px-4 md:px-6 py-32 mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold">Projeto não encontrado</h1>
          <p className="text-muted-foreground text-lg">
            Não conseguimos encontrar o projeto que você está procurando.
            Pode ser que ele tenha sido movido ou removido.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" variant="default" className="gap-2">
              <Link to="/portfolio">
                <ArrowLeft className="h-5 w-5" /> Voltar ao Portfólio
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="gap-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Search className="h-5 w-5" /> Solicitar Projeto Personalizado
              </a>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t">
            <p className="text-muted-foreground">
              Precisa de ajuda para encontrar algo específico? Entre em contato conosco:
            </p>
            <p className="mt-2 font-medium">
              contato@casabrancareformas.com.br
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
