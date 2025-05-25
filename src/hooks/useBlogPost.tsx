
import { useState, useEffect } from 'react';

interface BlogPostData {
  title: string;
  content: string;
  publishedAt: string;
  author?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  wordCount?: number;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  lastModified?: string;
  featured?: boolean;
}

interface UseBlogPostReturn {
  post: BlogPostData | null;
  isLoading: boolean;
  error: string | null;
  previousPost?: { slug: string; title: string; excerpt?: string };
  nextPost?: { slug: string; title: string; excerpt?: string };
}

export const useBlogPost = (slug: string): UseBlogPostReturn => {
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previousPost, setPreviousPost] = useState<{ slug: string; title: string; excerpt?: string }>();
  const [nextPost, setNextPost] = useState<{ slug: string; title: string; excerpt?: string }>();

  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simular fetch do post - aqui você integraria com seu backend/CMS
        const response = await fetch(`/api/blog/${slug}`);
        
        if (!response.ok) {
          throw new Error('Post não encontrado');
        }
        
        const data = await response.json();
        setPost(data.post);
        setPreviousPost(data.previousPost);
        setNextPost(data.nextPost);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar post');
        console.error('Erro ao carregar post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  return {
    post,
    isLoading,
    error,
    previousPost,
    nextPost
  };
};
