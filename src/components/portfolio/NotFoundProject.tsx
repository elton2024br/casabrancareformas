
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export function NotFoundProject() {
  return (
    <>
      <Header />
      <div className="container px-4 md:px-6 py-32 mx-auto text-center">
        <h1 className="text-3xl font-bold">Projeto não encontrado</h1>
        <Link to="/portfolio" className="mt-4 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Portfólio
        </Link>
      </div>
      <Footer />
    </>
  );
}
