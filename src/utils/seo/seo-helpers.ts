
export const getSiteUrl = () => "https://casabrancareformas.com";

export const getCurrentUrl = () => {
  const siteUrl = getSiteUrl();
  const currentPath = window.location.pathname;
  return `${siteUrl}${currentPath}`;
};

export const getCanonicalUrl = (providedCanonical?: string) => {
  return providedCanonical || getCurrentUrl();
};

export const getSocialTitle = (ogTitle?: string, title?: string) => {
  return ogTitle || title;
};

export const getSocialDescription = (ogDescription?: string, description?: string) => {
  return ogDescription || description;
};

export const getTwitterCardTitle = (twitterTitle?: string, socialTitle?: string) => {
  return twitterTitle || socialTitle;
};

export const getTwitterCardDescription = (twitterDescription?: string, socialDescription?: string) => {
  return twitterDescription || socialDescription;
};
