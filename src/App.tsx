
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

// Importação lazy das páginas
const Index = lazy(() => import("./pages/Index"));
const Depoimentos = lazy(() => import("./pages/Depoimentos"));
const Contato = lazy(() => import("./pages/Contato"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Importação lazy das páginas de admin
const Login = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminContent = lazy(() => import("./pages/admin/AdminContent"));
const AdminDepoimentos = lazy(() => import("./pages/admin/AdminDepoimentos"));
const AdminContatos = lazy(() => import("./pages/admin/AdminContatos"));
const BlogAdmin = lazy(() => import("./pages/admin/BlogAdmin"));

// Componente de carregamento para Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Defined as a proper function component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes com preload para LCP */}
                <Route path="/" element={<Index />} />
                <Route path="/depoimentos" element={<Depoimentos />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="depoimentos" element={<AdminDepoimentos />} />
                  <Route path="contatos" element={<AdminContatos />} />
                  <Route path="blog" element={<BlogAdmin />} />
                </Route>
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

// Precarregar a página inicial para melhor LCP
const preloadHomeRoute = () => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "script";
  link.href = "/src/pages/Index.tsx";
  document.head.appendChild(link);
};

// Executar preload logo após a renderização inicial
window.addEventListener("load", preloadHomeRoute);

export default App;
