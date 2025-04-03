
export function PortfolioSchemaData() {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Portfólio de Projetos | Casa Branca Reformas",
        "description": "Conheça nosso portfólio de reformas residenciais e comerciais.",
        "provider": {
          "@type": "Organization",
          "name": "Casa Branca Reformas",
          "url": window.location.origin
        }
      })}
    </script>
  );
}
