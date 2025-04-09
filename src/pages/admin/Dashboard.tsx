import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, LayoutDashboard, Users, FolderOpen, MessageSquare, Building, FileText, Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statsCards = [
  {
    title: "Projetos",
    value: "24",
    description: "Projetos no portfólio",
    icon: <FolderOpen className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Depoimentos",
    value: "18",
    description: "Clientes satisfeitos",
    icon: <MessageSquare className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Contatos",
    value: "37",
    description: "Mensagens recebidas",
    icon: <Users className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: "Visitas",
    value: "2,845",
    description: "Nos últimos 30 dias",
    icon: <BarChart className="h-6 w-6 text-muted-foreground" />,
  },
];

const Dashboard = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Building className="mr-2 h-5 w-5" />
              Portfólio
            </CardTitle>
            <CardDescription>
              Gerencie os projetos no portfólio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Adicione, remova ou edite projetos de reforma que aparecem no portfólio do site.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/portfolio">Gerenciar Portfólio</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Depoimentos Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Users className="mr-2 h-5 w-5" />
              Depoimentos
            </CardTitle>
            <CardDescription>
              Gerencie depoimentos de clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Adicione, remova ou edite depoimentos de clientes que aparecem na seção de testimoniais.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/depoimentos">Gerenciar Depoimentos</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Conteúdo Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-2 h-5 w-5" />
              Conteúdo
            </CardTitle>
            <CardDescription>
              Edite o conteúdo do site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Atualize textos, imagens e informações que aparecem nas páginas principais do site.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/conteudo">Editar Conteúdo</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Blog Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <Book className="mr-2 h-5 w-5" />
              Blog
            </CardTitle>
            <CardDescription>
              Gerencie o conteúdo do blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crie, edite e publique artigos no blog, aproveitando o gerador de conteúdo com IA integrado.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/blog">Gerenciar Blog</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Mensagens Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <MessageSquare className="mr-2 h-5 w-5" />
              Mensagens
            </CardTitle>
            <CardDescription>
              Visualize mensagens de contato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Acesse as mensagens enviadas por clientes através do formulário de contato.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/admin/contatos">Ver Mensagens</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Analytics Placeholder */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl">
              <BarChart className="mr-2 h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>
              Estatísticas do site
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualize estatísticas de visitantes, páginas mais acessadas e conversões.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Em breve
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
