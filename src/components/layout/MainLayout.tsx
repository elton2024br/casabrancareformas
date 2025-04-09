import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

type MainLayoutProps = {
  children: ReactNode;
  showWhatsApp?: boolean;
};

export default function MainLayout({
  children,
  showWhatsApp = true,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      
      {/* Botões flutuantes */}
      {showWhatsApp && (
        <FloatingActionButton 
          phoneNumber="5512997767048" 
          message="Olá! Gostaria de um orçamento para meu projeto."
        />
      )}
      <ScrollToTop className="md:flex" />
    </div>
  );
} 