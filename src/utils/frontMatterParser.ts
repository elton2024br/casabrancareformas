/**
 * Utilitário para processar o front matter de arquivos markdown
 * Extrai os metadados e o conteúdo de um arquivo markdown
 */

interface FrontMatterResult {
  data: Record<string, any>;
  content: string;
}

/**
 * Extrai metadados e conteúdo de um arquivo markdown com front matter
 * @param markdown String contendo o conteúdo markdown completo
 * @returns Objeto com os dados do front matter e o conteúdo
 */
export function parseFrontMatter(markdown: string): FrontMatterResult {
  // Valor padrão caso não haja front matter
  const defaultResult: FrontMatterResult = { 
    data: {}, 
    content: markdown 
  };
  
  // Verifica se o markdown começa com delimitador de front matter
  if (!markdown.startsWith('---')) return defaultResult;
  
  // Encontra o fim do front matter
  const endOfFrontMatter = markdown.indexOf('---', 3);
  if (endOfFrontMatter === -1) return defaultResult;
  
  // Extrai as partes
  const frontMatter = markdown.substring(3, endOfFrontMatter).trim();
  const content = markdown.substring(endOfFrontMatter + 3).trim();
  
  // Processa o front matter
  const data: Record<string, any> = {};
  frontMatter.split('\n').forEach(line => {
    const colonPosition = line.indexOf(':');
    if (colonPosition !== -1) {
      const key = line.slice(0, colonPosition).trim();
      let value: any = line.slice(colonPosition + 1).trim();
      
      // Remove aspas
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Converte arrays simples
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value
          .slice(1, -1)
          .split(',')
          .map((item: string) => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      }
      
      // Trata valores especiais
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      
      data[key] = value;
    }
  });
  
  return { data, content };
}

/**
 * Gera uma string de front matter a partir de um objeto de dados
 * @param data Objeto contendo os metadados para o front matter
 * @returns String formatada como front matter
 */
export function generateFrontMatter(data: Record<string, any>): string {
  const lines = Object.entries(data).map(([key, value]) => {
    // Trata diferentes tipos de dados
    if (Array.isArray(value)) {
      // Formata arrays como [item1, item2]
      const arrayItems = value.map(item => {
        return typeof item === 'string' ? `"${item}"` : item;
      }).join(', ');
      return `${key}: [${arrayItems}]`;
    } else if (typeof value === 'string') {
      // Adiciona aspas a strings
      return `${key}: "${value}"`;
    } else {
      // Outros tipos (boolean, number, etc)
      return `${key}: ${value}`;
    }
  });
  
  return ['---', ...lines, '---'].join('\n');
}

/**
 * Gera um slug a partir de um texto
 * @param text Texto para gerar o slug
 * @returns Slug formatado
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
    .replace(/^-|-$/g, '');          // Remove hífens no início e fim
} 