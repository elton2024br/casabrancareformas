
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Edit, Save, Image as ImageIcon, RefreshCw, CheckCircle, Video, Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

const initialContent = {
  hero: {
    title: "Transformamos espaços em experiências",
    subtitle: "Design minimalista e execução impecável para sua reforma dos sonhos",
    backgroundImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop",
    useVideo: false,
    videoUrl: ""
  },
  about: {
    title: "Sobre a Casa Branca",
    subtitle: "Tradição e inovação em reformas residenciais e comerciais",
    description: "Fundada há mais de 10 anos, a Casa Branca Reformas se consolidou no mercado com um trabalho minucioso e atento às necessidades de cada cliente. Nossa equipe multidisciplinar une arquitetos, designers e engenheiros para criar soluções completas que transformam espaços em ambientes funcionais e esteticamente impressionantes."
  },
  aboutPage: {
    title: "Conheça Elton \"Casabranca\"",
    subtitle: "A história por trás da nossa empresa e do profissional que transformou o mercado de reformas",
    description: "Desde muito jovem, Elton já demonstrava um interesse natural pela construção civil. Ainda na adolescência, começou a trabalhar como ajudante em pequenas obras, onde descobriu sua verdadeira vocação e ganhou o apelido que carregaria por toda sua vida: \"Casabranca\".",
    image: "/lovable-uploads/e71547ce-5de6-44ec-8b00-1ff5abc20379.png",
    profesionalHistory: "Aos 18 anos, Casabranca já coordenava pequenas equipes em reformas residenciais. A combinação de conhecimento técnico, habilidade prática e um olhar atento para detalhes o diferenciou no mercado. Com o passar dos anos, foi ampliando seu escopo de trabalho, passando de residências para escritórios comerciais e mais tarde para projetos de maior escala.",
    workPhilosophy: "Para Casabranca, a construção civil não é apenas uma profissão, mas uma forma de transformar ambientes e vidas. Sua filosofia de trabalho baseia-se em três pilares: Excelência técnica, Transparência e Inovação.",
    certifications: [
      "Técnico em Edificações - SENAI",
      "Especialista em Gestão de Projetos - FGV",
      "Certificação em Técnicas Sustentáveis",
      "Mais de 15 anos de experiência prática"
    ],
    mission: "Transformar espaços físicos em ambientes que inspiram, acolhem e elevam a qualidade de vida das pessoas. Cada projeto é uma oportunidade de fazer a diferença, combinando excelência técnica com uma visão humana da construção civil."
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
    description: "Entre em contato para um orçamento personalizado e dê o primeiro passo para a reforma dos seus sonhos.",
    useVideo: false,
    videoUrl: ""
  }
};

const isValidVideoUrl = (url: string) => {
  if (!url) return false;
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+$/;
  
  return youtubeRegex.test(url) || vimeoRegex.test(url);
};

const AdminContent = () => {
  const [content, setContent] = useState(initialContent);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempContent, setTempContent] = useState({});
  const [activeTab, setActiveTab] = useState("hero");
  const [videoError, setVideoError] = useState<string | null>(null);
  const [editingCertification, setEditingCertification] = useState<number | null>(null);
  const [tempCertification, setTempCertification] = useState("");

  const handleEditSection = (section: string) => {
    setEditingSection(section);
    setTempContent(content[section as keyof typeof content]);
    setVideoError(null);
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
    
    if (name === "videoUrl") {
      setVideoError(null);
    }
  };

  const handleToggleChange = (name: string, value: boolean) => {
    setTempContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSection = () => {
    if (editingSection) {
      const tempContentTyped = tempContent as any;
      if (tempContentTyped.useVideo && tempContentTyped.videoUrl) {
        if (!isValidVideoUrl(tempContentTyped.videoUrl)) {
          setVideoError("URL de vídeo inválida. Use apenas links do YouTube ou Vimeo.");
          return;
        }
      }

      setContent(prev => ({ ...prev, [editingSection]: tempContent }));
      setEditingSection(null);
      setVideoError(null);
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
    } else if (section === "aboutPage") {
      setContent(prev => ({
        ...prev,
        aboutPage: {
          ...prev.aboutPage,
          image: imageUrl
        }
      }));
    }
    toast.success("Imagem atualizada com sucesso!");
  };

  const handleAddCertification = () => {
    if (tempCertification.trim()) {
      setContent(prev => ({
        ...prev,
        aboutPage: {
          ...prev.aboutPage,
          certifications: [...prev.aboutPage.certifications, tempCertification]
        }
      }));
      setTempCertification("");
      toast.success("Certificação adicionada com sucesso!");
    }
  };

  const handleEditCertification = (index: number) => {
    setEditingCertification(index);
    setTempCertification(content.aboutPage.certifications[index]);
  };

  const handleSaveCertification = () => {
    if (editingCertification !== null && tempCertification.trim()) {
      const newCertifications = [...content.aboutPage.certifications];
      newCertifications[editingCertification] = tempCertification;
      
      setContent(prev => ({
        ...prev,
        aboutPage: {
          ...prev.aboutPage,
          certifications: newCertifications
        }
      }));
      
      setEditingCertification(null);
      setTempCertification("");
      toast.success("Certificação atualizada com sucesso!");
    }
  };

  const handleDeleteCertification = (index: number) => {
    const newCertifications = content.aboutPage.certifications.filter((_, i) => i !== index);
    
    setContent(prev => ({
      ...prev,
      aboutPage: {
        ...prev.aboutPage,
        certifications: newCertifications
      }
    }));
    
    toast.success("Certificação removida com sucesso!");
  };

  const handleApplyChanges = () => {
    toast.success("Todas as alterações foram aplicadas ao site!");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciar Conteúdo do Site</h1>
          <p className="text-muted-foreground">
            Edite textos, imagens e vídeos de diferentes seções do site
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
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="aboutPage">Página Sobre</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

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
              
              {content.hero.useVideo ? (
                <div>
                  <Label className="text-sm font-medium">Vídeo Atual</Label>
                  <div className="mt-2 relative aspect-video overflow-hidden rounded-md border">
                    {content.hero.videoUrl ? (
                      <iframe 
                        src={content.hero.videoUrl.replace('watch?v=', 'embed/')} 
                        className="w-full h-full" 
                        title="Hero Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <p className="text-muted-foreground">Nenhum vídeo configurado</p>
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="absolute bottom-2 right-2"
                        >
                          <Video className="h-4 w-4 mr-2" /> Alterar Vídeo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alterar Vídeo</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="videoUrl">URL do Vídeo (YouTube ou Vimeo)</Label>
                            <Input 
                              id="videoUrl" 
                              placeholder="https://www.youtube.com/watch?v=..." 
                              defaultValue={content.hero.videoUrl}
                            />
                            <p className="text-xs text-muted-foreground">
                              Insira um link do YouTube ou Vimeo
                            </p>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              const input = document.getElementById("videoUrl") as HTMLInputElement;
                              if (input.value) {
                                if (isValidVideoUrl(input.value)) {
                                  setContent(prev => ({
                                    ...prev,
                                    hero: {
                                      ...prev.hero,
                                      videoUrl: input.value
                                    }
                                  }));
                                  toast.success("Vídeo atualizado com sucesso!");
                                } else {
                                  toast.error("URL de vídeo inválida. Use apenas links do YouTube ou Vimeo.");
                                }
                              }
                            }}
                          >
                            Salvar Vídeo
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
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
              )}
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
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useVideo" 
                      checked={(tempContent as any).useVideo || false}
                      onCheckedChange={(checked) => handleToggleChange("useVideo", checked)}
                    />
                    <Label htmlFor="useVideo">Usar vídeo em vez de imagem</Label>
                  </div>
                  
                  {(tempContent as any).useVideo && (
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL do Vídeo (YouTube ou Vimeo)</Label>
                      <Input 
                        id="videoUrl" 
                        name="videoUrl" 
                        value={(tempContent as any).videoUrl || ""} 
                        onChange={handleContentChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Insira um link do YouTube ou Vimeo
                      </p>
                      {videoError && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{videoError}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                  
                  {!(tempContent as any).useVideo && (
                    <div className="space-y-2">
                      <Label htmlFor="backgroundImage">URL da Imagem de Fundo</Label>
                      <Input 
                        id="backgroundImage" 
                        name="backgroundImage" 
                        value={(tempContent as any).backgroundImage || ""} 
                        onChange={handleContentChange} 
                      />
                    </div>
                  )}
                  
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

        <TabsContent value="aboutPage" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Página Sobre (Detalhes Completos)</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditSection("aboutPage")}
                >
                  <Edit className="h-4 w-4 mr-2" /> Editar Conteúdo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Título Atual</Label>
                  <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.aboutPage.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subtítulo Atual</Label>
                  <p className="mt-1 p-2 border rounded-md bg-muted/50">{content.aboutPage.subtitle}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Descrição Atual</Label>
                <p className="mt-1 p-2 border rounded-md bg-muted/50 whitespace-pre-wrap">{content.aboutPage.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">História Profissional Atual</Label>
                <p className="mt-1 p-2 border rounded-md bg-muted/50 whitespace-pre-wrap">{content.aboutPage.profesionalHistory}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Filosofia de Trabalho Atual</Label>
                <p className="mt-1 p-2 border rounded-md bg-muted/50 whitespace-pre-wrap">{content.aboutPage.workPhilosophy}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Missão Atual</Label>
                <p className="mt-1 p-2 border rounded-md bg-muted/50 whitespace-pre-wrap">{content.aboutPage.mission}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Certificações e Formação</Label>
                <div className="mt-1 p-2 border rounded-md bg-muted/50">
                  <ul className="space-y-1 list-disc pl-5">
                    {content.aboutPage.certifications.map((cert, index) => (
                      <li key={index} className="flex items-center justify-between group">
                        <span>{cert}</span>
                        <div className="hidden group-hover:flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0" 
                            onClick={() => handleEditCertification(index)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-destructive" 
                            onClick={() => handleDeleteCertification(index)}
                          >
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {editingCertification !== null ? (
                    <div className="flex items-center mt-2 space-x-2">
                      <Input 
                        value={tempCertification}
                        onChange={(e) => setTempCertification(e.target.value)}
                        placeholder="Editar certificação..."
                        className="flex-1 h-8 text-sm"
                      />
                      <Button size="sm" className="h-8" onClick={handleSaveCertification}>Salvar</Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8"
                        onClick={() => {
                          setEditingCertification(null);
                          setTempCertification("");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center mt-2 space-x-2">
                      <Input 
                        value={tempCertification}
                        onChange={(e) => setTempCertification(e.target.value)}
                        placeholder="Nova certificação..."
                        className="flex-1 h-8 text-sm"
                      />
                      <Button size="sm" className="h-8" onClick={handleAddCertification}>Adicionar</Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Imagem Principal</Label>
                <div className="mt-2 relative aspect-[4/5] w-full max-w-xs overflow-hidden rounded-md border">
                  <img 
                    src={content.aboutPage.image} 
                    alt="Elton Casabranca" 
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
                        <DialogTitle>Alterar Imagem</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="aboutPageImage">URL da Imagem</Label>
                          <Input 
                            id="aboutPageImage" 
                            placeholder="https://exemplo.com/imagem.jpg" 
                            defaultValue={content.aboutPage.image}
                          />
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            const input = document.getElementById("aboutPageImage") as HTMLInputElement;
                            if (input.value) {
                              handleImageChange(input.value, "aboutPage", "image");
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

          {editingSection === "aboutPage" && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle>Editar Página Sobre</CardTitle>
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
                    <Label htmlFor="description">Descrição Principal</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      rows={3}
                      value={(tempContent as any).description || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profesionalHistory">História Profissional</Label>
                    <Textarea 
                      id="profesionalHistory" 
                      name="profesionalHistory" 
                      rows={4}
                      value={(tempContent as any).profesionalHistory || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workPhilosophy">Filosofia de Trabalho</Label>
                    <Textarea 
                      id="workPhilosophy" 
                      name="workPhilosophy" 
                      rows={3}
                      value={(tempContent as any).workPhilosophy || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mission">Missão</Label>
                    <Textarea 
                      id="mission" 
                      name="mission" 
                      rows={3}
                      value={(tempContent as any).mission || ""} 
                      onChange={handleContentChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">URL da Imagem</Label>
                    <Input 
                      id="image" 
                      name="image" 
                      value={(tempContent as any).image || ""} 
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
              
              {content.cta.useVideo && (
                <div>
                  <Label className="text-sm font-medium">Vídeo Atual</Label>
                  <div className="mt-2 relative aspect-video overflow-hidden rounded-md border">
                    {content.cta.videoUrl ? (
                      <iframe 
                        src={content.cta.videoUrl.replace('watch?v=', 'embed/')} 
                        className="w-full h-full" 
                        title="CTA Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <p className="text-muted-foreground">Nenhum vídeo configurado</p>
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="absolute bottom-2 right-2"
                        >
                          <Video className="h-4 w-4 mr-2" /> Alterar Vídeo
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Alterar Vídeo</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="ctaVideoUrl">URL do Vídeo (YouTube ou Vimeo)</Label>
                            <Input 
                              id="ctaVideoUrl" 
                              placeholder="https://www.youtube.com/watch?v=..." 
                              defaultValue={content.cta.videoUrl}
                            />
                            <p className="text-xs text-muted-foreground">
                              Insira um link do YouTube ou Vimeo
                            </p>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={() => {
                              const input = document.getElementById("ctaVideoUrl") as HTMLInputElement;
                              if (input.value) {
                                if (isValidVideoUrl(input.value)) {
                                  setContent(prev => ({
                                    ...prev,
                                    cta: {
                                      ...prev.cta,
                                      videoUrl: input.value
                                    }
                                  }));
                                  toast.success("Vídeo atualizado com sucesso!");
                                } else {
                                  toast.error("URL de vídeo inválida. Use apenas links do YouTube ou Vimeo.");
                                }
                              }
                            }}
                          >
                            Salvar Vídeo
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
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
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useVideo" 
                      checked={(tempContent as any).useVideo || false}
                      onCheckedChange={(checked) => handleToggleChange("useVideo", checked)}
                    />
                    <Label htmlFor="useVideo">Adicionar vídeo a esta seção</Label>
                  </div>
                  
                  {(tempContent as any).useVideo && (
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL do Vídeo (YouTube ou Vimeo)</Label>
                      <Input 
                        id="videoUrl" 
                        name="videoUrl" 
                        value={(tempContent as any).videoUrl || ""} 
                        onChange={handleContentChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Insira um link do YouTube ou Vimeo
                      </p>
                      {videoError && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{videoError}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                  
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
                Você também pode adicionar vídeos do YouTube ou Vimeo às seções Hero e CTA.
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
