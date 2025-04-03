
import { useState, useEffect } from 'react';
import { searchFreepikImages, type FreepikImage } from '@/services/freepikService';

interface UseFreepikImagesProps {
  initialQuery?: string;
  limit?: number;
}

export function useFreepikImages({ initialQuery = '', limit = 20 }: UseFreepikImagesProps = {}) {
  const [images, setImages] = useState<FreepikImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(0);

  const fetchImages = async (searchQuery: string = query, pageNumber: number = page) => {
    if (!searchQuery) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchFreepikImages(searchQuery, limit, pageNumber * limit);
      setImages(results);
      setPage(pageNumber);
      setQuery(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar imagens');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => fetchImages(query, page + 1);
  const previousPage = () => fetchImages(query, Math.max(0, page - 1));
  
  useEffect(() => {
    if (initialQuery) {
      fetchImages(initialQuery, 0);
    }
  }, []);

  return {
    images,
    loading,
    error,
    fetchImages,
    nextPage,
    previousPage,
    page,
    query,
    setQuery
  };
}
