
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

  // Dados da empresa para Schema.org
  const businessData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Casa Branca Reformas",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": `${siteUrl}${ogImage}`,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. Paulista, 1000",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "postalCode": "01310-100",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.5629,
      "longitude": -46.6544
    },
    "telephone": "+551299776-7048",
    "email": "contato@casabrancareformas.com.br",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "areaServed": {
      "@type": "City",
      "name": "Ubatuba",
      "addressRegion": "SP",
      "addressCountry": "BR"
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
      "https://www.instagram.com/casabrancareformas",
      "https://www.linkedin.com/company/casabrancareformas"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+551299776-7048",
      "contactType": "customer service",
      "availableLanguage": ["Portuguese"]
    }
  };

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
    </Helmet>
  );
}
