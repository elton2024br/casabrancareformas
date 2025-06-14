
import { Helmet } from "react-helmet-async";

interface SeoMetaProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  language?: string;
  alternateUrls?: { [lang: string]: string };
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  localBusiness?: boolean;
  organizationSchema?: boolean;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export function SeoMeta({
  title,
  description,
  keywords = "reformas, design de interiores, arquitetura, reformas residenciais, reformas comerciais, projetos personalizados",
  ogImage = "/og-image.jpg",
  ogImageAlt = "Casa Branca Reformas - Construção Civil em Ubatuba",
  twitterImage = "/twitter-image.jpg",
  canonicalUrl,
  noindex = false,
  language = "pt-BR",
  alternateUrls,
  publishedTime,
  modifiedTime,
  author = "Casa Branca Reformas",
  localBusiness = true,
  organizationSchema = true,
  ogType = "website",
  ogTitle,
  ogDescription,
  twitterTitle,
  twitterDescription,
}: SeoMetaProps) {
  const siteUrl = "https://casabrancareformas.com";
  const currentPath = window.location.pathname;
  const currentUrl = `${siteUrl}${currentPath}`;
  
  // URL canônica: usa a fornecida ou gera dinamicamente
  const canonical = canonicalUrl || currentUrl;
  
  // Títulos e descrições para redes sociais (usa específicos ou fallback)
  const socialTitle = ogTitle || title;
  const socialDescription = ogDescription || description;
  const twitterCardTitle = twitterTitle || socialTitle;
  const twitterCardDescription = twitterDescription || socialDescription;

  // Dados da empresa para Schema.org - LocalBusiness
  const businessData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Casa Branca Reformas",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": [`${siteUrl}${ogImage}`, `${siteUrl}/images/company-photo.jpg`],
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
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Casa Branca Reformas",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
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
  };

  // Breadcrumb Schema para páginas internas
  const breadcrumbData = currentPath !== "/" ? {
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
  } : null;

  return (
    <Helmet>
      {/* Configuração de Idioma */}
      <html lang={language} />
      
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* URL Canônica */}
      <link rel="canonical" href={canonical} />
      
      {/* Alternate Languages, se disponíveis */}
      {alternateUrls && Object.entries(alternateUrls).map(([lang, url]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={language.replace('-', '_')} />
      <meta property="og:site_name" content="Casa Branca Reformas" />
      
      {/* Artigo metadata, se disponível */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterCardTitle} />
      <meta name="twitter:description" content={twitterCardDescription} />
      <meta name="twitter:image" content={`${siteUrl}${twitterImage}`} />
      <meta name="twitter:image:alt" content={ogImageAlt} />
      
      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#ffffff" />
      
      {/* Geo Tags para SEO Local */}
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="Ubatuba" />
      <meta name="geo.position" content="-23.4344;-45.0839" />
      <meta name="ICBM" content="-23.4344, -45.0839" />
      
      {/* Structured Data - LocalBusiness */}
      {localBusiness && (
        <script type="application/ld+json">
          {JSON.stringify(businessData)}
        </script>
      )}
      
      {/* Structured Data - Organization */}
      {organizationSchema && (
        <script type="application/ld+json">
          {JSON.stringify(organizationData)}
        </script>
      )}
      
      {/* Structured Data - Breadcrumb para páginas internas */}
      {breadcrumbData && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      )}
    </Helmet>
  );
}
