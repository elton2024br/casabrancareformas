import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { parseFrontMatter } from "@/utils/frontMatterParser";
import MainLayout from "@/components/layout/MainLayout";
import { SeoMeta } from "@/components/ui/seo-meta";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { BlogComments } from "@/components/blog/BlogComments";
import { BlogShare } from "@/components/blog/BlogShare";

interface BlogPostData {
  title: string;
  content: string;
  publishedAt: string;
  category?: string;
  tags: string[];
  imageUrl?: string;
  author?: string;
  description?: string;
  mobileSrc?: string;
  lastUpdated?: string;
  researchDate?: string;
  researchSource?: string;
}

// Função para formatar data
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
    return dateString;
  }
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError("Slug não encontrado na URL");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log(`[BlogPost] Carregando post com slug: ${slug}`);
        
        // Buscar todos os arquivos .md
        const modules = import.meta.glob('/src/content/blog/*.md', { as: 'raw' });
        console.log("[BlogPost] Arquivos disponíveis:", Object.keys(modules));
        
        // Encontrar o arquivo que corresponde ao slug
        const filePath = Object.keys(modules).find(path => 
          path.endsWith(`${slug}.md`)
        );
        
        if (!filePath || !modules[filePath]) {
          setError(`Post não encontrado: ${slug}`);
          setIsLoading(false);
          return;
        }
        
        // Carregar o conteúdo do arquivo
        const rawContent = await modules[filePath]();
        const { data, content } = parseFrontMatter(rawContent);
        
        console.log(`[BlogPost] Front matter carregado:`, data);
        
        setPost({
          title: data.title || "Sem título",
          content,
          publishedAt: data.date || new Date().toISOString(),
          category: data.category,
          tags: Array.isArray(data.tags) ? data.tags : [],
          imageUrl: data.imageUrl,
          author: data.author,
          description: data.description,
          mobileSrc: data.mobileSrc,
          lastUpdated: data.lastUpdated,
          researchDate: data.researchDate,
          researchSource: data.researchSource
        });
      } catch (err) {
        console.error("[BlogPost] Erro ao carregar post:", err);
        setError("Erro ao carregar o post. Por favor, tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12 text-center">
          Carregando artigo...
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="container py-12 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-6">{error || "Este artigo não está disponível."}</p>
          <Button asChild>
            <Link to="/blog">Voltar para o Blog</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Função para renderizar o markdown em HTML simplificada
  const renderMarkdown = (markdown: string) => {
    // Processar cabeçalhos
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-5 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mt-6 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-5">$1</h1>');
    
    // Processar parágrafos
    html = html.replace(/^\s*(\n)?(.+)/gim, function(m) {
      return /\<(\/)?(h|ul|ol|li|blockquote|code|hr)/gim.test(m) ? m : '<p class="mb-4">' + m + '</p>';
    });
    
    // Processar links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>');
    
    // Processar negrito e itálico
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    
    // Listas não ordenadas
    html = html.replace(/^\s*\*\s?(.*)/gim, '<li>$1</li>');
    html = html.replace(/<li>(.*)<\/li>/gim, function(m) {
      if (m.match(/<\/li>\s*<li>/)) return m;
      return '<ul class="list-disc pl-5 mb-4">' + m + '</ul>';
    });
    
    return html;
  };

  return (
    <MainLayout>
      <SeoMeta
        title={`${post.title} | Casa Branca Reformas`}
        description={post.description || `${post.title}. Leia este artigo da Casa Branca Reformas.`}
        keywords={post.tags.join(", ")}
        canonicalUrl={`https://www.casabrancareformas.com.br/blog/${slug}`}
        publishedTime={post.publishedAt}
        modifiedTime={post.lastUpdated || post.publishedAt}
      />
      
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: "Home", url: "/" },
          { label: "Blog", url: "/blog" },
          ...(post.category ? [{ 
            label: post.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
            url: `/blog?categoria=${post.category}` 
          }] : []),
          { label: post.title, url: `/blog/${slug}` }
        ]}
      />
      
      <article className="container py-8 md:py-12">
        <header className="mb-8">
          {post.category && (
            <Link 
              to={`/blog?categoria=${post.category}`}
              className="inline-block bg-primary text-white text-sm px-3 py-1 rounded mb-4 hover:bg-primary/90"
            >
              {post.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Link>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center text-muted-foreground text-sm mb-6">
            <div className="flex items-center mr-6 mb-2 sm:mb-0">
              {post.author && (
                <span className="mr-4">Por: {post.author}</span>
              )}
              <time dateTime={post.publishedAt} className="flex items-center">
                <span className="mr-1">Publicado:</span>
                {formatDate(post.publishedAt)}
              </time>
            </div>
            
            {post.lastUpdated && (
              <div className="flex items-center">
                <span className="mr-1">Atualizado:</span>
                <time dateTime={post.lastUpdated}>{formatDate(post.lastUpdated)}</time>
              </div>
            )}
          </div>
          
          {post.imageUrl && (
            <div className="w-full aspect-video overflow-hidden rounded-lg mb-8">
              <OptimizedImage
                src={post.imageUrl}
                mobileSrc={post.mobileSrc}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>
        
        {/* Informações de pesquisa atual */}
        {post.researchDate && (
          <div className="bg-muted/30 border border-muted p-4 rounded-md mb-6">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Este artigo contém pesquisa atualizada de {formatDate(post.researchDate)}</span>
              {post.researchSource && (
                <span className="ml-2">via {post.researchSource}</span>
              )}
            </div>
            <p className="text-sm">Informações atualizadas para que você possa tomar as melhores decisões para seu projeto de reforma.</p>
          </div>
        )}
        
        {/* Componente de compartilhamento no topo */}
        <BlogShare 
          url={`/blog/${slug}`} 
          title={post.title} 
          description={post.description} 
        />
        
        {/* Conteúdo do post */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link 
                  key={index}
                  to={`/blog?busca=${tag}`}
                  className="inline-flex items-center bg-muted/50 hover:bg-muted text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Compartilhamento no final do post */}
        <BlogShare 
          url={`/blog/${slug}`} 
          title={post.title} 
          description={post.description} 
        />
        
        {/* Seção de navegação entre posts */}
        <div className="mt-10 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="block text-sm text-muted-foreground mb-2">Post anterior</span>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/blog">Ver mais posts</Link>
            </Button>
          </div>
          
          <div className="text-right">
            <span className="block text-sm text-muted-foreground mb-2">Próximo post</span>
            <Button variant="outline" className="w-full justify-end" asChild>
              <Link to="/blog">Ver mais posts</Link>
            </Button>
          </div>
        </div>
        
        {/* Seção de Comentários */}
        <BlogComments postSlug={slug || ""} />
      </article>
      
      {/* Schema.org para BlogPosting */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description || post.title,
          "url": `https://www.casabrancareformas.com.br/blog/${slug}`,
          "datePublished": post.publishedAt,
          "dateModified": post.publishedAt,
          "author": {
            "@type": "Person",
            "name": post.author || "Casa Branca Reformas"
          },
          ...(post.imageUrl && {
            "image": {
              "@type": "ImageObject",
              "url": `https://www.casabrancareformas.com.br${post.imageUrl}`
            }
          }),
          "publisher": {
            "@type": "Organization",
            "name": "Casa Branca Reformas",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.casabrancareformas.com.br/logo.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.casabrancareformas.com.br/blog/${slug}`
          },
          "keywords": post.tags.join(", ")
        })}
      </script>
    </MainLayout>
  );
} 