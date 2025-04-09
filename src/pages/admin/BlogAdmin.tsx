import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Book, Edit, FileText, Trash2, Plus, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateArticle, factCheckArticle, enrichArticle, generateSEOMetadata } from "@/utils/contentGenerator";
import { parseFrontMatter } from "@/utils/frontMatterParser";

// Tipagens
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  imageUrl?: string;
  mobileSrc?: string;
  author?: string;
  category?: string;
  tags: string[];
  lastUpdated?: string;
  researchDate?: string;
  researchSource?: string;
}

interface FrontMatterData {
  title?: string;
  description?: string;
  date?: string;
  imageUrl?: string;
  mobileSrc?: string;
  author?: string;
  category?: string;
  tags?: string[];
  lastUpdated?: string;
  researchDate?: string;
  researchSource?: string;
  [key: string]: any;
}

interface ProgressState {
  stage: string;
  message: string;
  percentage: number;
}

// Categorias predefinidas
const predefinedCategories = [
  { name: "Reformas Residenciais", slug: "reformas-residenciais" },
  { name: "Design de Interiores", slug: "design-de-interiores" },
  { name: "Dicas e Inspirações", slug: "dicas-e-inspiracoes" },
  { name: "Antes e Depois", slug: "antes-e-depois" },
  { name: "Tendências", slug: "tendencias" },
  { name: "Materiais", slug: "materiais" },
  { name: "Projetos Comerciais", slug: "projetos-comerciais" }
];

// Componente principal
export default function BlogAdmin() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  // Estados para geração de conteúdo
  const [generationTopic, setGenerationTopic] = useState("");
  const [generationOptions, setGenerationOptions] = useState({
    tone: "informativo",
    audience: "intermediário",
    minWords: 800,
    maxWords: 1500,
    includeSources: true,
    includeFAQs: true,
    includeMetadata: true
  });
  const [generationProgress, setGenerationProgress] = useState<ProgressState | null>(null);
  const [generatedArticle, setGeneratedArticle] = useState<any | null>(null);

  // Carregar posts ao iniciar
  useEffect(() => {
    loadPosts();
  }, []);

  // Carrega posts do diretório
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      // Implementação simplificada - em produção, seria feita via API
      // Emular o carregamento da lista de posts para demonstração
      const modules = await import.meta.glob('/src/content/blog/*.md', { as: 'raw' });
      const postsPromises = Object.entries(modules).map(async ([path, resolver]) => {
        const rawContent = await resolver();
        // Extrair nome do arquivo (slug) do caminho
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        
        // Parsear front matter
        const { data, content } = parseFrontMatter(rawContent);
        const frontMatterData = data as FrontMatterData;
        
        return {
          slug,
          title: frontMatterData.title || 'Sem Título',
          excerpt: frontMatterData.description || content.substring(0, 150) + '...',
          content,
          publishedAt: frontMatterData.date || new Date().toISOString(),
          imageUrl: frontMatterData.imageUrl,
          mobileSrc: frontMatterData.mobileSrc,
          author: frontMatterData.author,
          category: frontMatterData.category,
          tags: Array.isArray(frontMatterData.tags) ? frontMatterData.tags : [],
          lastUpdated: frontMatterData.lastUpdated,
          researchDate: frontMatterData.researchDate,
          researchSource: frontMatterData.researchSource
        };
      });

      const loadedPosts = await Promise.all(postsPromises);
      setPosts(loadedPosts);
      
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      toast.error("Erro ao carregar posts do blog");
    } finally {
      setIsLoading(false);
    }
  };

  // Cria novo post em branco
  const createNewPost = () => {
    const newPost: BlogPost = {
      slug: generateSlug('novo-artigo'),
      title: "Novo Artigo",
      excerpt: "Breve descrição do artigo",
      content: "Conteúdo do artigo aqui...",
      publishedAt: new Date().toISOString(),
      tags: [],
    };
    setCurrentPost(newPost);
    setIsEditing(true);
    setActiveTab("editor");
  };

  // Abre post para edição
  const editPost = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditing(true);
    setActiveTab("editor");
  };

  // Salva post
  const savePost = async () => {
    if (!currentPost) return;
    
    try {
      // Montar o conteúdo markdown com front matter
      const frontMatter = [
        '---',
        `title: "${currentPost.title}"`,
        `date: "${currentPost.publishedAt}"`,
        currentPost.lastUpdated ? `lastUpdated: "${currentPost.lastUpdated}"` : '',
        currentPost.category ? `category: "${currentPost.category}"` : '',
        currentPost.author ? `author: "${currentPost.author}"` : '',
        currentPost.imageUrl ? `imageUrl: "${currentPost.imageUrl}"` : '',
        currentPost.mobileSrc ? `mobileSrc: "${currentPost.mobileSrc}"` : '',
        currentPost.researchDate ? `researchDate: "${currentPost.researchDate}"` : '',
        currentPost.researchSource ? `researchSource: "${currentPost.researchSource}"` : '',
        `tags: [${currentPost.tags.map(tag => `"${tag}"`).join(', ')}]`,
        `description: "${currentPost.excerpt}"`,
        '---',
        '',
        currentPost.content
      ].filter(Boolean).join('\n');

      // Em produção, isso seria enviado para a API para salvar no sistema de arquivos
      console.log('Salvando post:', currentPost.slug);
      console.log('Conteúdo:', frontMatter);
      
      // Atualizar a lista de posts
      setPosts(prev => {
        const existingPostIndex = prev.findIndex(p => p.slug === currentPost.slug);
        if (existingPostIndex >= 0) {
          // Atualizar post existente
          const updatedPosts = [...prev];
          updatedPosts[existingPostIndex] = currentPost;
          return updatedPosts;
        } else {
          // Adicionar novo post
          return [...prev, currentPost];
        }
      });
      
      setIsEditing(false);
      toast.success("Post salvo com sucesso!");
      
    } catch (error) {
      console.error("Erro ao salvar post:", error);
      toast.error("Erro ao salvar post");
    }
  };

  // Exclui um post
  const deletePost = async (slug: string) => {
    try {
      // Em produção, chamaria a API para excluir o arquivo
      console.log('Excluindo post:', slug);
      
      // Atualiza a lista local
      setPosts(prev => prev.filter(post => post.slug !== slug));
      
      if (currentPost?.slug === slug) {
        setCurrentPost(null);
        setIsEditing(false);
      }
      
      toast.success("Post excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      toast.error("Erro ao excluir post");
    }
  };

  // Gera slug a partir do título
  const generateSlug = (title: string) => {
    const baseSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Verificar duplicatas e adicionar número se necessário
    const slugExists = posts.some(post => post.slug === baseSlug);
    if (!slugExists) return baseSlug;
    
    // Adicionar número ao final para evitar duplicatas
    let counter = 1;
    let newSlug = `${baseSlug}-${counter}`;
    while (posts.some(post => post.slug === newSlug)) {
      counter++;
      newSlug = `${baseSlug}-${counter}`;
    }
    
    return newSlug;
  };

  // Atualiza um campo do post atual
  const updatePostField = (field: keyof BlogPost, value: any) => {
    if (!currentPost) return;
    
    setCurrentPost(prev => {
      if (!prev) return null;
      
      const updated = { ...prev, [field]: value };
      
      // Gerar slug automaticamente ao mudar o título
      if (field === 'title' && !isEditing) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  // Gera artigo com IA
  const handleGenerateArticle = async () => {
    if (!generationTopic.trim()) {
      toast.error("Por favor, insira um tópico para o artigo");
      return;
    }
    
    setGenerationProgress({ stage: 'starting', message: 'Iniciando geração...', percentage: 0 });
    setOpenDialog('generating');
    
    try {
      const result = await generateArticle(generationTopic, {
        ...generationOptions,
        onProgress: (progress) => {
          setGenerationProgress(progress);
        }
      });
      
      setGeneratedArticle(result);
      setOpenDialog('generated');
      toast.success("Artigo gerado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao gerar artigo:", error);
      toast.error("Erro ao gerar artigo com IA");
      setOpenDialog(null);
    } finally {
      setGenerationProgress(null);
    }
  };

  // Usa o artigo gerado
  const useGeneratedArticle = () => {
    if (!generatedArticle) return;
    
    const newPost: BlogPost = {
      slug: generateSlug(generatedArticle.title),
      title: generatedArticle.title,
      excerpt: generatedArticle.metadata?.description || generatedArticle.content.substring(0, 150) + '...',
      content: generatedArticle.content,
      publishedAt: new Date().toISOString(),
      tags: generatedArticle.metadata?.keywords || [],
      category: generatedArticle.metadata?.suggestedCategories?.[0] || 'sem-categoria',
      researchDate: new Date().toISOString(),
      researchSource: 'IA Casabranca',
    };
    
    setCurrentPost(newPost);
    setIsEditing(true);
    setActiveTab("editor");
    setOpenDialog(null);
  };

  // Renderização do componente
  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciamento do Blog</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">
            <FileText className="w-4 h-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="editor" disabled={!currentPost}>
            <Edit className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="generator">
            <Sparkles className="w-4 h-4 mr-2" />
            Gerador de Conteúdo
          </TabsTrigger>
        </TabsList>
        
        {/* Lista de Posts */}
        <TabsContent value="posts">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Posts do Blog</h2>
            <Button onClick={createNewPost}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Post
            </Button>
          </div>
          
          {isLoading ? (
            <div className="py-8 text-center">Carregando posts...</div>
          ) : posts.length === 0 ? (
            <div className="py-8 text-center">
              <Book className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Nenhum post encontrado</h3>
              <p className="text-muted-foreground mb-4">Comece criando seu primeiro post no blog</p>
              <Button onClick={createNewPost}>Criar Post</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Card key={post.slug} className="overflow-hidden">
                  {post.imageUrl && (
                    <div className="w-full h-40 overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>
                      {post.category && (
                        <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded mb-2">
                          {post.category.replace(/-/g, ' ')}
                        </span>
                      )}
                      <div className="text-xs text-muted-foreground">
                        Publicado: {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => editPost(post)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setCurrentPost(post);
                        setOpenDialog('confirmDelete');
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Editor de Post */}
        <TabsContent value="editor">
          {currentPost && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Editando Post" : "Visualizando Post"}
                </h2>
                <div className="space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={savePost}>
                        Salvar Post
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna Esquerda - Dados Básicos */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input 
                      id="title"
                      value={currentPost.title}
                      onChange={(e) => updatePostField('title', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input 
                      id="slug"
                      value={currentPost.slug}
                      onChange={(e) => updatePostField('slug', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea 
                      id="excerpt"
                      value={currentPost.excerpt}
                      onChange={(e) => updatePostField('excerpt', e.target.value)}
                      rows={3}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select 
                        disabled={!isEditing}
                        value={currentPost.category || ""}
                        onValueChange={(value) => updatePostField('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {predefinedCategories.map(category => (
                            <SelectItem key={category.slug} value={category.slug}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Autor</Label>
                      <Input 
                        id="author"
                        value={currentPost.author || ""}
                        onChange={(e) => updatePostField('author', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL da Imagem</Label>
                    <Input 
                      id="imageUrl"
                      value={currentPost.imageUrl || ""}
                      onChange={(e) => updatePostField('imageUrl', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobileSrc">URL da Imagem Mobile</Label>
                    <Input 
                      id="mobileSrc"
                      value={currentPost.mobileSrc || ""}
                      onChange={(e) => updatePostField('mobileSrc', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                {/* Coluna Direita - Conteúdo e Metadados */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea 
                      id="content"
                      value={currentPost.content}
                      onChange={(e) => updatePostField('content', e.target.value)}
                      rows={12}
                      disabled={!isEditing}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input 
                      id="tags"
                      value={currentPost.tags.join(", ")}
                      onChange={(e) => updatePostField('tags', e.target.value.split(",").map(tag => tag.trim()).filter(Boolean))}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="publishedAt">Data de Publicação</Label>
                      <Input 
                        id="publishedAt"
                        type="date"
                        value={currentPost.publishedAt.split('T')[0]}
                        onChange={(e) => updatePostField('publishedAt', `${e.target.value}T12:00:00Z`)}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastUpdated">Última Atualização</Label>
                      <Input 
                        id="lastUpdated"
                        type="date"
                        value={currentPost.lastUpdated?.split('T')[0] || ""}
                        onChange={(e) => updatePostField('lastUpdated', e.target.value ? `${e.target.value}T12:00:00Z` : "")}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pesquisa do Conteúdo</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="researchDate">Data da Pesquisa</Label>
                        <Input 
                          id="researchDate"
                          type="date"
                          value={currentPost.researchDate?.split('T')[0] || ""}
                          onChange={(e) => updatePostField('researchDate', e.target.value ? `${e.target.value}T12:00:00Z` : "")}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="researchSource">Fonte da Pesquisa</Label>
                        <Input 
                          id="researchSource"
                          value={currentPost.researchSource || ""}
                          onChange={(e) => updatePostField('researchSource', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Gerador de Conteúdo */}
        <TabsContent value="generator">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Gerador de Conteúdo com IA</h2>
            
            <div className="bg-muted/30 border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Gerar Novo Artigo</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Tópico do Artigo</Label>
                  <Textarea 
                    id="topic"
                    placeholder="Ex: Tendências de design de interiores para 2024"
                    value={generationTopic}
                    onChange={(e) => setGenerationTopic(e.target.value)}
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tom do Conteúdo</Label>
                    <Select 
                      value={generationOptions.tone}
                      onValueChange={(value) => setGenerationOptions({...generationOptions, tone: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informativo">Informativo</SelectItem>
                        <SelectItem value="persuasivo">Persuasivo</SelectItem>
                        <SelectItem value="conversacional">Conversacional</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="audience">Público-Alvo</Label>
                    <Select 
                      value={generationOptions.audience}
                      onValueChange={(value) => setGenerationOptions({...generationOptions, audience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iniciante">Iniciante</SelectItem>
                        <SelectItem value="intermediário">Intermediário</SelectItem>
                        <SelectItem value="especialista">Especialista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="words">Tamanho do Artigo</Label>
                    <Select 
                      value={`${generationOptions.minWords}-${generationOptions.maxWords}`}
                      onValueChange={(value) => {
                        const [min, max] = value.split('-').map(Number);
                        setGenerationOptions({...generationOptions, minWords: min, maxWords: max});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500-800">Curto (500-800 palavras)</SelectItem>
                        <SelectItem value="800-1500">Médio (800-1500 palavras)</SelectItem>
                        <SelectItem value="1500-2500">Longo (1500-2500 palavras)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeSources" 
                      checked={generationOptions.includeSources}
                      onCheckedChange={(checked) => 
                        setGenerationOptions({...generationOptions, includeSources: !!checked})
                      }
                    />
                    <Label htmlFor="includeSources">Incluir fontes confiáveis</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeFAQs" 
                      checked={generationOptions.includeFAQs}
                      onCheckedChange={(checked) => 
                        setGenerationOptions({...generationOptions, includeFAQs: !!checked})
                      }
                    />
                    <Label htmlFor="includeFAQs">Incluir seção de perguntas frequentes</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="includeMetadata" 
                      checked={generationOptions.includeMetadata}
                      onCheckedChange={(checked) => 
                        setGenerationOptions({...generationOptions, includeMetadata: !!checked})
                      }
                    />
                    <Label htmlFor="includeMetadata">Gerar metadados para SEO</Label>
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    A geração de conteúdo pode levar alguns minutos, dependendo do tamanho 
                    e da complexidade do artigo solicitado.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  className="w-full" 
                  onClick={handleGenerateArticle}
                  disabled={!generationTopic.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Gerar Artigo
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={openDialog === 'confirmDelete'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir o post "{currentPost?.title}"?</p>
          <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>Cancelar</Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (currentPost) deletePost(currentPost.slug);
                setOpenDialog(null);
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Geração de Conteúdo */}
      <Dialog open={openDialog === 'generating'} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerando Artigo</DialogTitle>
          </DialogHeader>
          
          {generationProgress && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between text-sm">
                <span>{generationProgress.message}</span>
                <span>{Math.round(generationProgress.percentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${generationProgress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de Conteúdo Gerado */}
      <Dialog open={openDialog === 'generated'} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Artigo Gerado com Sucesso</DialogTitle>
          </DialogHeader>
          
          {generatedArticle && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-medium mb-2">Título:</h3>
                <p className="text-lg font-semibold">{generatedArticle.title}</p>
              </div>
              
              {generatedArticle.metadata && (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <h3 className="font-medium mb-2">Metadados:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Descrição: </span>
                      {generatedArticle.metadata.description}
                    </div>
                    <div>
                      <span className="font-medium">Keywords: </span>
                      {generatedArticle.metadata.keywords?.join(", ")}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border rounded-lg p-4 bg-muted/20 max-h-80 overflow-y-auto">
                <h3 className="font-medium mb-2">Prévia do Conteúdo:</h3>
                <div className="whitespace-pre-line text-sm">
                  {generatedArticle.content.slice(0, 500)}...
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Tamanho: </span>
                {generatedArticle.wordCount} palavras
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={useGeneratedArticle}>
              Usar este Artigo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 