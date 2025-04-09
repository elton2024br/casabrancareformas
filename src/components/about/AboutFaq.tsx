import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface AboutFaqProps {
  faqs?: FAQItem[];
}

export function AboutFaq({ faqs }: AboutFaqProps) {
  // Perguntas frequentes padrão (caso nenhuma seja fornecida)
  const defaultFaqs: FAQItem[] = [
    {
      question: "Quanto tempo leva para concluir uma reforma residencial?",
      answer: "O tempo de conclusão varia conforme o escopo do projeto. Reformas simples podem levar de 2 a 4 semanas, enquanto projetos mais complexos podem levar de 2 a 4 meses. Nós fornecemos um cronograma detalhado no início do projeto e mantemos você informado sobre o progresso ao longo do processo."
    },
    {
      question: "Vocês oferecem garantia para os serviços de reforma?",
      answer: "Sim, oferecemos garantia de 5 anos para problemas estruturais e 1 ano para acabamentos e instalações. Nossa equipe está comprometida com a qualidade e satisfação do cliente, e trabalhamos para resolver quaisquer problemas que possam surgir após a conclusão do projeto."
    },
    {
      question: "Como funciona o processo de orçamento?",
      answer: "Nosso processo de orçamento começa com uma consulta inicial gratuita para entender suas necessidades. Em seguida, realizamos uma visita técnica ao local para avaliar o espaço. Em até 5 dias úteis, apresentamos um orçamento detalhado com custos de materiais, mão de obra e cronograma estimado."
    },
    {
      question: "Vocês fornecem os materiais ou preciso comprá-los separadamente?",
      answer: "Oferecemos ambas as opções. Podemos fornecer todos os materiais necessários para seu projeto, o que simplifica o processo para você. Também trabalhamos com materiais fornecidos pelo cliente, se preferir. Em ambos os casos, garantimos a qualidade da instalação e o resultado final."
    },
    {
      question: "É possível fazer alterações no projeto durante a execução da obra?",
      answer: "Sim, entendemos que mudanças podem ser necessárias durante o processo. Pequenas alterações geralmente podem ser acomodadas dentro do escopo original. Para mudanças maiores, apresentamos um adendo ao contrato com os ajustes necessários em termos de custo e prazo. Nossa equipe é flexível e trabalha para realizar sua visão."
    }
  ];

  const faqItems = faqs || defaultFaqs;

  // Dados estruturados para o Schema.org FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-3">Perguntas Frequentes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Respondemos às dúvidas mais comuns sobre nossos serviços de reforma e processo de trabalho.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
      
      {/* Injetar o esquema JSON-LD para FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
} 