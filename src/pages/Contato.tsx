
import { useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import ContactForm from "@/components/forms/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: <Mail className="h-6 w-6 text-primary" />,
    title: "Email",
    details: "contato@casabrancareformas.com",
    link: "mailto:contato@casabrancareformas.com",
  },
  {
    icon: <Phone className="h-6 w-6 text-primary" />,
    title: "Telefone",
    details: "(11) 99999-9999",
    link: "tel:+5511999999999",
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
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-secondary">
        <div className="container px-4 md:px-6 mx-auto">
          <div
            className="max-w-3xl mx-auto text-center space-y-4"
            ref={(el) => addToRefs(el, 0)}
          >
            <SectionHeading
              title="Entre em Contato"
              subtitle="Estamos prontos para transformar seu espaço. Fale conosco!"
              centered
            />
          </div>
        </div>
      </section>

      {/* Contact Info and Form */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div ref={(el) => addToRefs(el, 1)}>
              <h3 className="text-2xl font-medium mb-6">Informações de Contato</h3>
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
                          target={item.title === "Endereço" ? "_blank" : undefined}
                          rel={item.title === "Endereço" ? "noopener noreferrer" : undefined}
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
              
              {/* Map */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Nossa Localização</h3>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
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
            </div>
            
            {/* Contact Form */}
            <div ref={(el) => addToRefs(el, 2)}>
              <h3 className="text-2xl font-medium mb-6">Envie uma Mensagem</h3>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default Contato;
