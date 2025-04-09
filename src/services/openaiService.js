import { OpenAI } from "openai";
import dotenv from 'dotenv';

// Carrega variáveis de ambiente
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateContent(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Você é um especialista em reformas residenciais que cria conteúdo informativo e otimizado para SEO." },
        { role: "user", content: prompt }
      ]
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Erro ao gerar conteúdo com OpenAI:", error);
    throw error;
  }
} 