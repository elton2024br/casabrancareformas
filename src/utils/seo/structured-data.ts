
import { getSiteUrl } from "./seo-helpers";

export const createBusinessData = (description: string, ogImage: string) => ({
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "name": "Casa Branca Reformas",
  "url": getSiteUrl(),
  "logo": `${getSiteUrl()}/logo.png`,
  "image": [`${getSiteUrl()}${ogImage}`, `${getSiteUrl()}/images/company-photo.jpg`],
  "description": description,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua das Reformas, 123",
    "addressLocality": "Ubatuba",
    "addressRegion": "SP",
    "postalCode": "11680-000",
    "addressCountry": "BR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -23.4344,
    "longitude": -45.0839
  },
  "telephone": "+5512997767048",
  "email": "contato@casabrancareformas.com.br",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "12:00"
    }
  ],
  "priceRange": "$$",
  "areaServed": [
    {
      "@type": "City",
      "name": "Ubatuba",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    {
      "@type": "City",
      "name": "Caraguatatuba",
      "addressRegion": "SP",
      "addressCountry": "BR"
    },
    {
      "@type": "City",
      "name": "São Sebastião",
      "addressRegion": "SP",
      "addressCountry": "BR"
    }
  ],
  "serviceType": [
    "Construção Civil",
    "Reformas Residenciais",
    "Reformas Comerciais",
    "Design de Interiores",
    "Ampliações",
    "Renovações"
  ],
  "foundingDate": "2014",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "87",
    "bestRating": "5"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Ana Oliveira"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "reviewBody": "A Casa Branca transformou completamente meu apartamento. O processo foi transparente e o resultado superou minhas expectativas."
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços de Construção e Reforma",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Reforma Residencial Completa",
          "description": "Reforma completa de residências incluindo projeto, execução e acabamento."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Construção de Casas",
          "description": "Construção de casas personalizadas do projeto à entrega da chave."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Design de Interiores",
          "description": "Projetos de design de interiores com foco em funcionalidade e estética."
        }
      }
    ]
  }
});

export const createOrganizationData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Casa Branca Reformas",
  "url": getSiteUrl(),
  "logo": `${getSiteUrl()}/logo.png`,
  "sameAs": [
    "https://www.facebook.com/casabrancareformas",
    "https://www.instagram.com/casabranca_reformas",
    "https://www.linkedin.com/company/casabrancareformas"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+5512997767048",
    "contactType": "customer service",
    "availableLanguage": ["Portuguese"],
    "areaServed": "BR"
  },
  "founder": {
    "@type": "Person",
    "name": "João Silva"
  }
});

export const createBreadcrumbData = (title: string, canonical: string) => {
  const currentPath = window.location.pathname;
  const siteUrl = getSiteUrl();
  
  if (currentPath === "/") return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": title.split(" | ")[0],
        "item": canonical
      }
    ]
  };
};
