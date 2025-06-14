
import { Helmet } from "react-helmet-async";
import { SeoMetaProps } from "@/types/seo";
import {
  getSiteUrl,
  getCanonicalUrl,
  getSocialTitle,
  getSocialDescription,
  getTwitterCardTitle,
  getTwitterCardDescription,
} from "@/utils/seo/seo-helpers";
import {
  createBusinessData,
  createOrganizationData,
  createBreadcrumbData,
} from "@/utils/seo/structured-data";

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
  const siteUrl = getSiteUrl();
  const canonical = getCanonicalUrl(canonicalUrl);
  
  const socialTitle = getSocialTitle(ogTitle, title);
  const socialDescription = getSocialDescription(ogDescription, description);
  const twitterCardTitle = getTwitterCardTitle(twitterTitle, socialTitle);
  const twitterCardDescription = getTwitterCardDescription(twitterDescription, socialDescription);

  const businessData = createBusinessData(description, ogImage);
  const organizationData = createOrganizationData();
  const breadcrumbData = createBreadcrumbData(title, canonical);

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
