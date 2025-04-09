import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { parseFrontMatter } from "@/utils/frontMatterParser"; // Adicionar import do nosso parser
import MainLayout from "@/components/layout/MainLayout";
import { SeoMeta } from "@/components/ui/seo-meta";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Tipos
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string; // Tornar opcional, pode não estar no front matter
  author?: string;   // Tornar opcional
  publishedAt: string; // Manter como string da data
  category?: string;  // Tornar opcional
  tags: string[];
  mobileSrc?: string; // Tornar opcional
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

// Função de formatação de data
const formatDate = (dateString: string) => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  } catch (e) {
    console.error("Erro ao formatar data:", dateString, e);
    return dateString; // Retorna a string original em caso de erro
  }
};

// Componente do Blog
export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams(); // Adicionado setSearchParams
  const categoryParam = searchParams.get("categoria");
  const searchQuery = searchParams.get("busca") || "";
  
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(searchQuery);
  const [activeCategory, setActiveCategory] = useState<string | null>(categoryParam);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  // Carregar posts dinamicamente
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      console.log("[Blog] Iniciando fetchPosts...");
      try {
        const modules = import.meta.glob('/src/content/blog/*.md', { as: 'raw' }); 
        console.log("[Blog] Modules encontrados por glob (como raw):", modules);

        const postsPromises = Object.entries(modules).map(async ([path, resolver]) => {
          console.log(`[Blog] Processando path: ${path}`);
          try {
            const rawContent = await resolver(); 
            const { data, content } = parseFrontMatter(rawContent);
            console.log(`[Blog] Front matter parseado com sucesso:`, data);
            
            const slug = path.split('/').pop()?.replace('.md', '') || '';
            
            const post: BlogPost = {
              slug,
              title: data.title || 'Título Padrão',
              excerpt: data.description || content.substring(0, 150) + '...',
              content,
              publishedAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
              tags: Array.isArray(data.tags) ? data.tags : [],
              category: data.category || 'sem-categoria',
              imageUrl: data.imageUrl,
              author: data.author,
              mobileSrc: data.mobileSrc,
            };
            console.log(`[Blog] Post processado (${slug}):`, post);
            return post;
          } catch (processError) { 
            console.error(`[Blog] Erro ao processar ${path}:`, processError);
            return null; 
          }
        });

        const loadedPostsResult = await Promise.all(postsPromises);
        const loadedPosts = loadedPostsResult.filter(post => post !== null) as BlogPost[];
        
        console.log("[Blog] Posts carregados (antes de ordenar):", loadedPosts);

        loadedPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        console.log("[Blog] Posts carregados (depois de ordenar):", loadedPosts);

        setAllPosts(loadedPosts);
        
        // Gerar categorias dinamicamente
        const categoryCounts: { [key: string]: number } = {};
        loadedPosts.forEach(post => {
          const catSlug = post.category || 'sem-categoria';
          categoryCounts[catSlug] = (categoryCounts[catSlug] || 0) + 1;
        });
        const dynamicCategories = Object.entries(categoryCounts).map(([slug, count]) => ({
          name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
          slug,
          count
        }));
        console.log("[Blog] Categorias geradas:", dynamicCategories);
        setCategories(dynamicCategories);

      } catch (error) {
        console.error("[Blog] Erro GERAL ao carregar posts:", error);
      } finally {
        setIsLoading(false);
        console.log("[Blog] fetchPosts finalizado.");
      }
    };

    fetchPosts();
  }, []);

  // Filtrar posts com base nos filtros e busca
  useEffect(() => {
    console.log("[Blog] useEffect de filtragem disparado. isLoading:", isLoading, "activeCategory:", activeCategory, "search:", search, "allPosts count:", allPosts.length);
    if (isLoading) {
        console.log("[Blog] Filtragem pulada (isLoading=true)");
        return;
    }

    let postsToFilter = [...allPosts];
    
    // Filtrar por categoria
    if (activeCategory) {
      postsToFilter = postsToFilter.filter(post => post.category === activeCategory);
    }
    
    // Filtrar por termo de busca
    if (search) {
      const searchLower = search.toLowerCase();
      postsToFilter = postsToFilter.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.excerpt.toLowerCase().includes(searchLower) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    setFilteredPosts(postsToFilter);
    console.log("[Blog] Posts filtrados definidos:", postsToFilter);

    // Atualiza os searchParams na URL sem recarregar a página
    const newSearchParams = new URLSearchParams();
    if (search) newSearchParams.set("busca", search);
    if (activeCategory) newSearchParams.set("categoria", activeCategory);
    setSearchParams(newSearchParams, { replace: true }); // Usa replace para não poluir o histórico

  }, [activeCategory, search, allPosts, isLoading, setSearchParams]); // Depende de allPosts e isLoading agora

  // Atualiza activeCategory quando searchParams mudam externamente (ex: link direto)
  useEffect(() => {
    setActiveCategory(searchParams.get("categoria"));
    setSearch(searchParams.get("busca") || "");
  }, [searchParams]);
  
  // Meta dados para SEO
  const currentCategoryName = categories.find(c => c.slug === activeCategory)?.name || 'Reformas';
  const title = activeCategory 
    ? `Blog sobre ${currentCategoryName} | Casa Branca Reformas`
    : "Blog de Reformas e Design de Interiores | Casa Branca Reformas";
    
  const description = activeCategory
    ? `Artigos, dicas e inspirações sobre ${currentCategoryName.toLowerCase()} para sua casa ou espaço comercial.`
    : "Dicas, tendências e inspirações para reformas residenciais e comerciais, design de interiores e decoração. Conteúdo especializado para transformar ambientes.";
  
  // Handler para clique em categoria
  const handleCategoryClick = (slug: string | null) => {
    setActiveCategory(slug);
    // Limpa busca ao mudar categoria? Opcional.
    // setSearch(""); 
  };

  // Handler para busca
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A filtragem já acontece no useEffect ao mudar o estado 'search'
    // Apenas para garantir que a URL reflete a busca
    const newSearchParams = new URLSearchParams(searchParams);
    if (search) {
      newSearchParams.set("busca", search);
    } else {
      newSearchParams.delete("busca");
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          Carregando artigos...
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <SeoMeta
        title={title}
        description={description}
        keywords={`reformas, design de interiores, blog de arquitetura, dicas de decoração, ${activeCategory || 'tendências em reformas'}`}
        canonicalUrl={`https://www.casabrancareformas.com.br/blog${activeCategory ? `?categoria=${activeCategory}` : ''}`}
        // Ajustar datas para o post mais recente carregado
        publishedTime={allPosts[0]?.publishedAt} 
        modifiedTime={new Date().toISOString().split('T')[0]} 
      />
      
      {/* Breadcrumbs para SEO */}
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Blog", url: "/blog" },
          ...(activeCategory ? [{ 
            label: categories.find(c => c.slug === activeCategory)?.name || activeCategory, 
            url: `/blog?categoria=${activeCategory}` 
          }] : [])
        ]}
      />
      
      <div className="container py-8 md:py-12">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {activeCategory 
              ? `Blog: ${categories.find(c => c.slug === activeCategory)?.name || activeCategory}` 
              : "Blog Casa Branca Reformas"}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
            Dicas, inspirações e conteúdo especializado para ajudar você a transformar seus espaços com qualidade e estilo.
          </p>
          
          {/* Busca */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <Input 
              type="search" 
              placeholder="Buscar artigos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
              aria-label="Buscar artigos"
            />
            <Button 
              type="submit" 
              className="min-w-[100px]"
            >
              Buscar
            </Button>
          </form>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com categorias */}
          <aside className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-lg border p-4">
                <h2 className="text-xl font-semibold mb-3">Categorias</h2>
                <ul className="space-y-2">
                  <li>
                    {/* Usar Link do react-router-dom para navegação SPA */}
                    <Link 
                      to="/blog" 
                      className={`block p-2 rounded hover:bg-muted ${!activeCategory ? 'bg-primary/10 font-medium' : ''}`}
                      onClick={(e) => { 
                        e.preventDefault(); // Prevenir recarregamento completo
                        handleCategoryClick(null); 
                      }}
                    >
                      Todos os artigos
                    </Link>
                  </li>
                  {categories.map(category => (
                    <li key={category.slug}>
                      <Link 
                        to={`/blog?categoria=${category.slug}`} 
                        className={`block p-2 rounded hover:bg-muted ${activeCategory === category.slug ? 'bg-primary/10 font-medium' : ''}`}
                        onClick={(e) => { 
                          e.preventDefault(); 
                          handleCategoryClick(category.slug); 
                        }}
                      >
                        {category.name} <span className="text-muted-foreground text-sm">({category.count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Posts Populares - Usando os carregados, os 3 mais recentes */}
              <div className="rounded-lg border p-4">
                <h2 className="text-xl font-semibold mb-3">Posts Recentes</h2>
                <ul className="space-y-3">
                  {allPosts.slice(0, 3).map(post => (
                    <li key={post.slug}>
                      {/* Link para a página de detalhe do post (precisa ser criada) */}
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-sm hover:text-primary hover:underline font-medium"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
          
          {/* Lista de posts */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-medium">Nenhum artigo encontrado</h2>
                <p className="text-muted-foreground mt-2">
                  Tente ajustar os filtros ou termos de busca.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    handleCategoryClick(null);
                    setSearch("");
                  }}
                >
                  Ver todos os artigos
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <article key={post.slug} className="flex flex-col h-full border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Link para a página de detalhe do post */}
                    <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full">
                      <div className="relative aspect-video w-full overflow-hidden">
                        {/* Usar imagem padrão se imageUrl não estiver definida */}
                        <OptimizedImage
                          src={post.imageUrl || '/images/blog/placeholder.jpg'} 
                          mobileSrc={post.mobileSrc}
                          alt={post.title}
                          width={600}
                          height={338}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy" // Adiciona lazy loading
                        />
                        {post.category && (
                          <div className="absolute bottom-0 left-0 bg-primary text-white text-xs px-3 py-1 rounded-tr">
                            {/* Busca nome da categoria */}
                            {categories.find(c => c.slug === post.category)?.name || post.category}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2" title={post.title}>
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-auto flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {formatDate(post.publishedAt)}
                          </span>
                          <span className="font-medium text-primary inline-flex items-center">
                            Ler mais <span className="ml-1">→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Esquema JSON-LD para Blog - Atualizado para usar dados dinâmicos */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "headline": title, // Usa o título dinâmico
          "description": description,
          "url": `https://www.casabrancareformas.com.br/blog${activeCategory ? `?categoria=${activeCategory}` : ''}`,
          "author": {
            "@type": "Organization",
            "name": "Casa Branca Reformas",
            "url": "https://www.casabrancareformas.com.br"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Casa Branca Reformas",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.casabrancareformas.com.br/logo.png" // Manter ou atualizar se necessário
            }
          },
          // Mapeia os posts carregados dinamicamente
          "blogPost": allPosts.map(post => ({ 
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "url": `https://www.casabrancareformas.com.br/blog/${post.slug}`,
            "datePublished": post.publishedAt,
            "dateModified": post.publishedAt, // Simplificado, pode buscar 'updatedAt' se existir no front matter
            "author": {
              "@type": "Person",
              "name": post.author || "Casa Branca Reformas" // Nome padrão se não houver autor
            },
            ...(post.imageUrl && { // Adiciona imagem apenas se existir
              "image": {
                "@type": "ImageObject",
                "url": `https://www.casabrancareformas.com.br${post.imageUrl}`
              }
            }),
            "keywords": post.tags.join(", ")
          }))
        })}
      </script>
    </MainLayout>
  );
} 