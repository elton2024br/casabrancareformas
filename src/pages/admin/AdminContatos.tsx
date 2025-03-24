
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ArrowDown, ArrowUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Mock data for contacts
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "in-progress" | "completed";
}

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@email.com",
    phone: "(11) 99999-8888",
    subject: "Orçamento para reforma de cozinha",
    message: "Olá, gostaria de solicitar um orçamento para reforma completa da minha cozinha. O espaço tem aproximadamente 12m² e preciso de uma solução funcional e moderna.",
    date: "2023-05-10T14:30:00",
    status: "new",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@email.com",
    phone: "(11) 98765-4321",
    subject: "Dúvida sobre materiais",
    message: "Estou com dúvidas sobre os materiais utilizados nos acabamentos dos seus projetos. Vocês trabalham com materiais sustentáveis?",
    date: "2023-05-09T10:15:00",
    status: "in-progress",
  },
  {
    id: "3",
    name: "Carla Oliveira",
    email: "carla.oliveira@email.com",
    subject: "Reforma de escritório comercial",
    message: "Preciso de um orçamento para reforma de um escritório comercial de 50m². Gostaria de agendar uma visita para avaliação.",
    date: "2023-05-08T09:00:00",
    status: "completed",
  },
];

const AdminContatos = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [responseText, setResponseText] = useState("");

  const handleSortToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleStatusChange = (id: string, status: Contact["status"]) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, status } : contact
      )
    );
    
    if (activeContact && activeContact.id === id) {
      setActiveContact({ ...activeContact, status });
    }
    
    toast.success("Status atualizado com sucesso!");
  };

  const handleSendResponse = () => {
    if (!activeContact || !responseText.trim()) return;
    
    // In a real app, this would send an email or save the response
    toast.success("Resposta enviada com sucesso!");
    
    // Update status to in-progress if it was new
    if (activeContact.status === "new") {
      handleStatusChange(activeContact.id, "in-progress");
    }
    
    setResponseText("");
  };

  const filteredContacts = contacts
    .filter((contact) => {
      // Filter by status
      if (filter !== "all" && contact.status !== filter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          contact.name.toLowerCase().includes(searchLower) ||
          contact.email.toLowerCase().includes(searchLower) ||
          contact.subject.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold">Gerenciar Contatos</h1>
        <p className="text-muted-foreground">
          Visualize e responda mensagens de contato dos clientes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Mensagens</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleSortToggle}
                  >
                    {sortOrder === "desc" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <Input
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3"
                />
                <div className="flex space-x-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filter === "new" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("new")}
                  >
                    Novos
                  </Button>
                  <Button
                    variant={filter === "in-progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("in-progress")}
                  >
                    Em Análise
                  </Button>
                  <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("completed")}
                  >
                    Concluídos
                  </Button>
                </div>
              </div>
              <div className="divide-y max-h-[600px] overflow-auto">
                {filteredContacts.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma mensagem encontrada
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                        activeContact?.id === contact.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveContact(contact)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium line-clamp-1">{contact.name}</h3>
                        <Badge
                          variant={
                            contact.status === "new"
                              ? "default"
                              : contact.status === "in-progress"
                              ? "outline"
                              : "secondary"
                          }
                          className="ml-2"
                        >
                          {contact.status === "new"
                            ? "Novo"
                            : contact.status === "in-progress"
                            ? "Em Análise"
                            : "Concluído"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {contact.subject}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        {formatDate(contact.date)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {activeContact ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{activeContact.subject}</CardTitle>
                    <div className="flex space-x-2 mt-1">
                      <Badge
                        variant={
                          activeContact.status === "new"
                            ? "default"
                            : activeContact.status === "in-progress"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {activeContact.status === "new"
                          ? "Novo"
                          : activeContact.status === "in-progress"
                          ? "Em Análise"
                          : "Concluído"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(activeContact.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(activeContact.id, "new")}
                      className={activeContact.status === "new" ? "bg-primary/10" : ""}
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Novo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(activeContact.id, "in-progress")}
                      className={activeContact.status === "in-progress" ? "bg-primary/10" : ""}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Em Análise
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(activeContact.id, "completed")}
                      className={activeContact.status === "completed" ? "bg-primary/10" : ""}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Concluído
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:space-x-6">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-sm font-medium mb-1">Informações de Contato</h3>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2" />
                            <a
                              href={`mailto:${activeContact.email}`}
                              className="hover:text-foreground transition-colors"
                            >
                              {activeContact.email}
                            </a>
                          </div>
                          {activeContact.phone && (
                            <div className="flex items-center text-muted-foreground">
                              <Phone className="h-4 w-4 mr-2" />
                              <a
                                href={`tel:${activeContact.phone}`}
                                className="hover:text-foreground transition-colors"
                              >
                                {activeContact.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Mensagem</h3>
                      <div className="p-4 bg-muted rounded-md">
                        <p className="text-sm whitespace-pre-line">
                          {activeContact.message}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="response" className="mb-2 block">
                        Resposta
                      </Label>
                      <Textarea
                        id="response"
                        placeholder="Digite sua resposta aqui..."
                        rows={5}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="mb-4"
                      />
                      <div className="flex justify-end">
                        <Button onClick={handleSendResponse} disabled={!responseText.trim()}>
                          Enviar Resposta
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center h-96">
              <CardContent className="text-center">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Nenhuma mensagem selecionada</h3>
                <p className="text-muted-foreground mt-1">
                  Selecione uma mensagem da lista para visualizar os detalhes
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContatos;
