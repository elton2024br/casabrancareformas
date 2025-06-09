
import { useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { SeoMeta } from "@/components/ui/seo-meta";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CtaSection } from "@/components/home/CtaSection";

const Index = () => {
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
      <SeoMeta 
        title="Casa Branca Reformas Ubatuba - Construção Civil e Reformas | 10 Anos"
        description="Casa Branca Reformas em Ubatuba - 10 anos de experiência em construção civil, reformas residenciais e comerciais. Transformamos espaços com design minimalista e execução impecável."
        keywords="construção civil ubatuba, reformas ubatuba, reformas residenciais, reformas comerciais, casa branca reformas, construção ubatuba"
        localBusiness={true}
        organizationSchema={true}
      />
      
      <MainLayout>
        <HeroSection addToRefs={addToRefs} />
        <AboutSection addToRefs={addToRefs} />
        <ServicesSection addToRefs={addToRefs} />
        <TestimonialsSection addToRefs={addToRefs} />
        <CtaSection addToRefs={addToRefs} />
      </MainLayout>
    </>
  );
};

export default Index;
