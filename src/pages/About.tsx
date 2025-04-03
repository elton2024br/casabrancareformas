
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <>
      <Header />
      <main className="pt-24 md:pt-28 pb-16">
        <section className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-12">
              <div className="md:w-1/2">
                <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
                  Conheça Elton "Casabranca"
                </h1>
                <p className="text-muted-foreground mb-6">
                  A história por trás da nossa empresa e do profissional que transformou o mercado de reformas.
                </p>
                <div className="prose prose-slate max-w-none">
                  <p>
                    Desde muito jovem, Elton já demonstrava um interesse natural pela construção civil. 
                    Ainda na adolescência, começou a trabalhar como ajudante em pequenas obras, onde descobriu 
                    sua verdadeira vocação e ganhou o apelido que carregaria por toda sua vida: "Casabranca".
                  </p>
                  <p>
                    O apelido surgiu de seu meticuloso trabalho com pinturas e acabamentos em gesso, sempre 
                    prezando pela perfeição em cada detalhe. Com o tempo, o que era um simples trabalho 
                    tornou-se uma paixão, levando-o a buscar conhecimento técnico e especialização na área.
                  </p>
                  <h3 className="text-xl font-medium mt-8 mb-3">Trajetória Profissional</h3>
                  <p>
                    Aos 18 anos, Casabranca já coordenava pequenas equipes em reformas residenciais. 
                    A combinação de conhecimento técnico, habilidade prática e um olhar atento para 
                    detalhes o diferenciou no mercado. Com o passar dos anos, foi ampliando seu escopo 
                    de trabalho, passando de residências para escritórios comerciais e mais tarde para 
                    projetos de maior escala.
                  </p>
                  <p>
                    Em 2010, fundou oficialmente a Casa Branca Reformas, empresa que hoje é referência 
                    no setor de reformas e renovações com um portfólio que inclui centenas de projetos 
                    bem-sucedidos em todo o estado de São Paulo.
                  </p>
                  <h3 className="text-xl font-medium mt-8 mb-3">Filosofia de Trabalho</h3>
                  <p>
                    Para Casabranca, a construção civil não é apenas uma profissão, mas uma forma de 
                    transformar ambientes e vidas. Sua filosofia de trabalho baseia-se em três pilares:
                  </p>
                  <ul>
                    <li><strong>Excelência técnica</strong> - Cada projeto segue rigorosos padrões de qualidade</li>
                    <li><strong>Transparência</strong> - Comunicação clara e honesta com os clientes em todas as etapas</li>
                    <li><strong>Inovação</strong> - Busca constante por novas técnicas e materiais sustentáveis</li>
                  </ul>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button asChild>
                    <Link to="/portfolio">Ver Portfólio</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/contato">Fale Conosco</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex flex-col gap-6">
                <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[4/5]">
                  <img 
                    src="/lovable-uploads/e71547ce-5de6-44ec-8b00-1ff5abc20379.png" 
                    alt="Elton 'Casabranca' com capacete amarelo de segurança em uma obra" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-secondary rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">Formação e Certificações</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-2 items-start">
                      <span className="text-primary">✓</span>
                      <span>Técnico em Edificações - SENAI</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-primary">✓</span>
                      <span>Especialista em Gestão de Projetos - FGV</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-primary">✓</span>
                      <span>Certificação em Técnicas Sustentáveis</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <span className="text-primary">✓</span>
                      <span>Mais de 15 anos de experiência prática</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-16 bg-muted rounded-lg p-8">
              <h2 className="text-2xl font-serif font-medium mb-6 text-center">Nossa Missão</h2>
              <blockquote className="italic text-lg text-center max-w-3xl mx-auto">
                "Transformar espaços físicos em ambientes que inspiram, acolhem e elevam a qualidade de vida das pessoas. 
                Cada projeto é uma oportunidade de fazer a diferença, combinando excelência técnica com uma visão humana 
                da construção civil."
              </blockquote>
              <p className="text-right mt-4 font-medium">— Elton "Casabranca"</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
