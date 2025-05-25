
/**
 * Calcula o tempo estimado de leitura baseado no número de palavras
 * @param content Conteúdo do post em HTML ou texto
 * @param wordsPerMinute Palavras por minuto (padrão: 200)
 * @returns Tempo de leitura em minutos
 */
export const calculateReadingTime = (content: string, wordsPerMinute: number = 200): number => {
  // Remove HTML tags e conta palavras
  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(readingTime, 1); // Mínimo 1 minuto
};

/**
 * Conta o número de palavras no conteúdo
 * @param content Conteúdo do post em HTML ou texto
 * @returns Número de palavras
 */
export const countWords = (content: string): number => {
  const textContent = content.replace(/<[^>]*>/g, '');
  return textContent.trim().split(/\s+/).length;
};

/**
 * Gera um excerpt do conteúdo
 * @param content Conteúdo completo
 * @param maxLength Tamanho máximo do excerpt
 * @returns Excerpt truncado
 */
export const generateExcerpt = (content: string, maxLength: number = 160): string => {
  const textContent = content.replace(/<[^>]*>/g, '');
  
  if (textContent.length <= maxLength) {
    return textContent;
  }
  
  return textContent.substring(0, maxLength).trim() + '...';
};

/**
 * Formata tags para exibição
 * @param tags Array de tags
 * @returns Tags formatadas
 */
export const formatTags = (tags: string[]): string[] => {
  return tags.map(tag => tag.toLowerCase().trim()).filter(Boolean);
};
