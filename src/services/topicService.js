import { generateContent } from "./openaiService.js";

/**
 * Gera ideias de tópicos relevantes para o blog
 * @param {string} [focusKeyword] - Palavra-chave para focar a geração (opcional)
 * @returns {Promise<string[]>} Array com tópicos de blog
 */
export async function generateTopicIdeas(focusKeyword = '') {
  try {
    // Adicionar a palavra-chave de foco ao prompt se fornecida
    const focusText = focusKeyword 
      ? `com foco especial em "${focusKeyword.replace(/-/g, ' ')}"` 
      : '';
    
    const prompt = `
    Gere 5 ideias de tópicos para um blog de uma empresa de reformas residenciais ${focusText}.
    Os tópicos devem ser relevantes para o público interessado em reformas e devem considerar:
    - Tendências atuais em design de interiores
    - Dicas práticas para reformas
    - Reformas com baixo orçamento
    - Sustentabilidade e materiais ecológicos
    - Comparação de materiais ou soluções
    
    ${focusKeyword ? `Todos os tópicos DEVEM estar relacionados a "${focusKeyword.replace(/-/g, ' ')}" de alguma forma.` : ''}
    
    Retorne apenas os títulos dos tópicos, separados por vírgulas.
    Certifique-se de que os títulos são otimizados para SEO e envolventes.
    `;
    
    const result = await generateContent(prompt);
    // Divide a string em array, remove espaços extras
    return result.split(",").map(topic => topic.trim());
  } catch (error) {
    console.error("Erro ao gerar ideias de tópicos:", error);
    throw error;
  }
} 