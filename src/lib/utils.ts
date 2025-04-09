import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extrai o ID do vídeo de uma URL do Instagram
 * Suporta formatos como:
 * - https://www.instagram.com/p/ABC123/
 * - https://www.instagram.com/reel/ABC123/
 * - https://instagram.com/p/ABC123/
 * - https://www.instagram.com/p/ABC123/?utm_source=ig_web_copy_link
 * 
 * @param url URL do Instagram
 * @returns ID do vídeo ou null se não for uma URL válida
 */
export function extractInstagramId(url: string): string | null {
  // Verificar se é uma URL do Instagram
  if (!url || !url.includes('instagram.com')) {
    return null;
  }

  // Tentar extrair o ID usando regex
  // Procurar por padrões /p/ID/ ou /reel/ID/
  const regex = /instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/;
  const match = url.match(regex);
  
  if (match && match[2]) {
    return match[2];
  }
  
  return null;
}

/**
 * Verifica se uma URL é um vídeo do Instagram (post, reel ou IGTV)
 */
export function isInstagramVideoUrl(url: string): boolean {
  if (!url) return false;
  
  // Verifica se a URL é do Instagram
  const isInstagram = url.includes('instagram.com');
  
  if (!isInstagram) return false;
  
  // Verificar se é um reel, IGTV ou post
  const isReel = url.includes('/reel/');
  const isIGTV = url.includes('/tv/');
  
  // Se for um reel ou IGTV, consideramos como vídeo
  if (isReel || isIGTV) return true;
  
  // Para posts normais (que podem ser fotos ou vídeos),
  // sem uma API ou acessando o conteúdo, não podemos ter certeza
  // Neste caso, dependemos da verificação visual do usuário ou
  // uma verificação mais profunda em tempo de execução
  
  return false;
}
