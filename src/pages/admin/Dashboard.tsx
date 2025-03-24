
import { useEffect, useState } from "react";
import { BarChart, LayoutDashboard, Users, FolderOpen, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel administrativo da Casa Branca Reformas
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
          {date.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          | {date.toLocaleTimeString("pt-BR")}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Novo projeto adicionado",
                  details: "Residência Moderna",
                  time: "2 horas atrás",
                },
                {
                  action: "Novo depoimento aprovado",
                  details: "De Roberto Almeida",
                  time: "5 horas atrás",
                },
                {
                  action: "Nova mensagem de contato",
                  details: "De Maria Silva",
                  time: "1 dia atrás",
                },
                {
                  action: "Projeto atualizado",
                  details: "Cozinha Escandinava",
                  time: "2 dias atrás",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="mt-1 bg-primary/10 rounded-full p-1">
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tarefas Pendentes</CardTitle>
            <CardDescription>Itens que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  task: "Responder mensagens de contato",
                  count: 5,
                  priority: "alta",
                },
                {
                  task: "Aprovar novos depoimentos",
                  count: 3,
                  priority: "média",
                },
                {
                  task: "Atualizar projeto do portfólio",
                  count: 2,
                  priority: "baixa",
                },
                {
                  task: "Revisar conteúdo do site",
                  count: 1,
                  priority: "média",
                },
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        task.priority === "alta"
                          ? "bg-destructive"
                          : task.priority === "média"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                    <span className="text-sm">{task.task}</span>
                  </div>
                  <div className="flex items-center justify-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                    {task.count}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
