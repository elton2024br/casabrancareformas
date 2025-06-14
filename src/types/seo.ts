
export interface SeoMetaProps {
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
