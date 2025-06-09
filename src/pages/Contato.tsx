
import { useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SeoMeta } from "@/components/ui/seo-meta";
import { SectionHeading } from "@/components/ui/section-heading";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: "Email",
    details: "contato@casabrancareformas.com",
    link: "mailto:contato@casabrancareformas.com",
  },
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: "Telefone/WhatsApp",
    details: "(12) 99776-7048",
    link: "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento.",
  },
  {
    icon: <MapPin className="h-6 w-6 text-primary" />,
    title: "Endereço",
    details: "Av. Paulista, 1000, Bela Vista, São Paulo - SP",
    link: "https://maps.google.com",
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Horário",
    details: "Segunda a Sexta: 9h às 18h",
  },
];

const Contato = () => {
  const observedElementsRef = useRef<(HTMLElement | null)[]>([]);
  const whatsappUrl = "https://wa.me/5512997767048?text=Gostaria%20de%20um%20orçamento.";

  useEffect(() => {
    const observedElements = observedElementsRef.current.filter(Boolean) as HTMLElement[];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observedElements.forEach((el) => {
      el.classList.add("opacity-0");
      observer.observe(el);
    });

    return () => {
      observedElements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const addToRefs = (el: HTMLElement | null, index: number) => {
    if (el && !observedElementsRef.current.includes(el)) {
      observedElementsRef.current[index] = el;
    }
  };

  return (
    <>
      <SeoMeta 
        title="Contato Casa Branca Reformas Ubatuba | Orçamento Gratuito"
        description="Entre em contato com a Casa Branca Reformas em Ubatuba. Orçamento gratuito para construção civil e reformas. Atendimento personalizado e pontualidade garantida!"
        keywords="contato casa branca reformas, orçamento reformas ubatuba, contato construção civil, reforma residencial ubatuba"
        canonicalUrl="https://casabrancareformas.com/contato"
        ogTitle="Contato Casa Branca Reformas Ubatuba | Orçamento Gratuito"
        ogDescription="Entre em contato para orçamento gratuito. Construção civil e reformas em Ubatuba com 10 anos de experiência."
        twitterTitle="Contato Casa Branca Reformas"
        twitterDescription="Orçamento gratuito para reformas e construção civil em Ubatuba. Atendimento personalizado."
        ogImage="/og-contact.jpg"
        twitterImage="/twitter-contact.jpg"
        ogImageAlt="Entre em contato com a Casa Branca Reformas em Ubatuba"
        localBusiness={true}
      />
      
      <MainLayout>
        {/* Main content */}
        <section className="py-24 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Contact Info */}
              <div>
                <h1 className="text-3xl font-serif font-medium mb-6">Fale Conosco</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Estamos prontos para transformar seu espaço. Entre em contato para tirar dúvidas, solicitar orçamentos ou agendar uma visita técnica.
                </p>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={item.title} className="flex items-start">
                      <div className="mr-4 mt-1">{item.icon}</div>
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-muted-foreground hover:text-primary transition-colors"
                            target={item.title === "Endereço" || item.title === "Telefone/WhatsApp" ? "_blank" : undefined}
                            rel={item.title === "Endereço" || item.title === "Telefone/WhatsApp" ? "noopener noreferrer" : undefined}
                          >
                            {item.details}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{item.details}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-card border rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="text-xl font-medium mb-4">Envie sua mensagem</h2>
                
                <form className="space-y-4">
                  <ContactForm />
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-8">
              <h2 className="text-2xl font-serif font-medium mb-2">Onde Estamos</h2>
              <p className="text-muted-foreground">
                Visite nosso escritório para uma reunião presencial.
              </p>
            </div>
            
            <div className="aspect-[16/9] md:aspect-video rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976671803936!2d-46.65390548535577!3d-23.563273284682373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1624312345678!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Mapa da localização"
              ></iframe>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
};

export default Contato;
