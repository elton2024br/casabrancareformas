
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Save, Image as ImageIcon, RefreshCw, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for website content (in a real app, this would come from a database)
const initialContent = {
  hero: {
    title: "Transformamos espaços em experiências",
    subtitle: "Design minimalista e execução impecável para sua reforma dos sonhos",
    backgroundImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop"
  },
  about: {
    title: "Sobre a Casa Branca",
    subtitle: "Tradição e inovação em reformas residenciais e comerciais",
    description: "Fundada há mais de 10 anos, a Casa Branca Reformas se consolidou no mercado com um trabalho minucioso e atento às necessidades de cada cliente. Nossa equipe multidisciplinar une arquitetos, designers e engenheiros para criar soluções completas que transformam espaços em ambientes funcionais e esteticamente impressionantes."
  },
  services: [
    {
      id: "1",
      title: "Reformas Residenciais",
      description: "Transformamos sua casa em um ambiente acolhedor e funcional, respeitando seu estilo e necessidades.",
      icon: "Home"
    },
    {
      id: "2",
      title: "Reformas Comerciais",
      description: "Criamos ambientes comerciais que transmitem a identidade da sua marca e proporcionam experiências positivas.",
      icon: "Building"
    },
    {
      id: "3",
      title: "Projetos Arquitetônicos",
      description: "Desenvolvemos projetos detalhados que unem estética, funcionalidade e viabilidade técnica.",
      icon: "Ruler"
    }
  ],
  cta: {
    title: "Transforme seu espaço com a Casa Branca",
    description: "Entre em contato para um orçamento personalizado e dê o primeiro passo para a reforma dos seus sonhos."
  }
};

const AdminContent = () => {
  const [content, setContent] = useState(initialContent);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState({});
  const [activeTab, setActiveTab] = useState("hero");

  const handleEditSection = (section: string) => {
    setEditingSection(section);
    setTempContent(content[section as keyof typeof content]);
  };

  const handleEditServiceItem = (id: string) => {
    const service = content.services.find(s => s.id === id);
    if (service) {
      setEditingItem(id);
      setTempContent(service);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSection = () => {
    if (editingSection) {
      setContent(prev => ({ ...prev, [editingSection]: tempContent }));
      setEditingSection(null);
      toast.success("Conteúdo atualizado com sucesso!");
    }
  };

  const handleSaveServiceItem = () => {
    if (editingItem) {
      const updatedServices = content.services.map(service => 
        service.id === editingItem ? { ...service, ...tempContent as any } : service
      );
      setContent(prev => ({ ...prev, services: updatedServices }));
      setEditingItem(null);
      toast.success("Serviço atualizado com sucesso!");
    }
  };

  const handleImageChange = (imageUrl: string, section: string, field = "backgroundImage") => {
    if (section === "hero") {
      setContent(prev => ({ 
        ...prev, 
        hero: { 
          ...prev.hero, 
          [field]: imageUrl 
        } 
      }));
    }
    toast.success("Imagem atualizada com sucesso!");
  };

  const handleApplyChanges = () => {
    // In a real app, this would send the data to an API
    toast.success("Todas as alterações foram aplicadas ao site!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciar Conteúdo do Site</h1>
          <p className="text-muted-foreground">
            Edite textos e imagens de diferentes seções do site
          </p>
        </div>
        <Button 
          onClick={handleApplyChanges} 
          className="mt-4 md:mt-0"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Aplicar Alterações
        </Button>
      </div>

      <Tabs 
        defaultValue="hero" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Seção Hero</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditSection("hero")}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar Conteúdo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Título Atual</Label>
                  <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.hero.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subtítulo Atual</Label>
                  <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.hero.subtitle}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Imagem de Fundo Atual</Label>
                <div className="mt-2 relative aspect-video overflow-hidden rounded-md border">
                  <img 
                    src={content.hero.backgroundImage} 
                    alt="Hero Background" 
                    className="w-full h-full object-cover"
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="absolute bottom-2 right-2"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" /> Alterar Imagem
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar Imagem de Fundo</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="imageUrl">URL da Imagem</Label>
                          <Input 
                            id="imageUrl" 
                            placeholder="https://exemplo.com/imagem.jpg" 
                            defaultValue={content.hero.backgroundImage}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1170&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600585152220-90462f5dbd88?q=80&w=2070&auto=format&fit=crop"
                          ].map((img, index) => (
                            <div 
                              key={index} 
                              className="cursor-pointer border rounded-md overflow-hidden aspect-video hover:opacity-75 transition-opacity"
                              onClick={() => handleImageChange(img, "hero")}
                            >
                              <img src={img} alt={`Option ${index+1}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            const input = document.getElementById("imageUrl") as HTMLInputElement;
                            if (input.value) {
                              handleImageChange(input.value, "hero");
                            }
                          }}
                        >
                          Salvar Imagem
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {editingSection === "hero" && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Editar Seção Hero</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={(tempContent as any).title || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Input 
                      id="subtitle" 
                      name="subtitle" 
                      value={(tempContent as any).subtitle || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleSaveSection}
                    >
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* About Section Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Seção Sobre Nós</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditSection("about")}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar Conteúdo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Título Atual</Label>
                  <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.about.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subtítulo Atual</Label>
                  <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.about.subtitle}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição Atual</Label>
                <p className="mt-1 p-2 border rounded-md bg-muted/50 whitespace-pre-wrap">{content.about.description}</p>
              </div>
            </CardContent>
          </Card>

          {editingSection === "about" && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Editar Seção Sobre Nós</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={(tempContent as any).title || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Input 
                      id="subtitle" 
                      name="subtitle" 
                      value={(tempContent as any).subtitle || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      rows={5}
                      value={(tempContent as any).description || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleSaveSection}
                    >
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Services Section Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {content.services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{service.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditServiceItem(service.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Ícone: {service.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editingItem && (
            <Card className="border-primary/50 mt-6">
              <CardHeader>
                <CardTitle>Editar Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={(tempContent as any).title || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      rows={3}
                      value={(tempContent as any).description || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Nome do Ícone</Label>
                    <Input 
                      id="icon" 
                      name="icon" 
                      value={(tempContent as any).icon || ""} 
                      onChange={handleContentChange} 
                      placeholder="Home, Building, Ruler, etc."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use nomes de ícones da biblioteca Lucide (Home, Building, Ruler, etc.)
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleSaveServiceItem}
                    >
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* CTA Section Tab */}
        <TabsContent value="cta" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Seção CTA</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditSection("cta")}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar Conteúdo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Título Atual</Label>
                <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.cta.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Descrição Atual</Label>
                <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.cta.description}</p>
              </div>
            </CardContent>
          </Card>

          {editingSection === "cta" && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Editar Seção CTA</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={(tempContent as any).title || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      rows={3}
                      value={(tempContent as any).description || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      onClick={handleSaveSection}
                    >
                      <Save className="h-4 w-4 mr-2" /> Salvar Alterações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50 border-dashed border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Como usar este painel</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Clique em "Editar Conteúdo" para modificar textos de cada seção. Para alterar imagens, clique em "Alterar Imagem".
                Depois de fazer todas as alterações desejadas, clique em "Aplicar Alterações" no topo da página para publicar as mudanças no site.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContent;
