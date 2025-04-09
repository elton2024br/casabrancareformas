import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb component with structured data for SEO
 * 
 * Renderiza uma trilha de navegação acessível com microdados schema.org
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  // Não renderiza nada se não houver itens
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "container py-3 text-sm",
          className
        )}
      >
        <ol 
          className="flex flex-wrap items-center gap-1"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            
            return (
              <li 
                key={item.url} 
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <a
                  href={item.url}
                  className={cn(
                    "hover:text-primary transition-colors",
                    isLast ? "font-medium text-primary" : "text-muted-foreground"
                  )}
                  aria-current={isLast ? "page" : undefined}
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
                <meta itemProp="position" content={String(index + 1)} />
                
                {!isLast && (
                  <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/60" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      
      {/* Schema.org BreadcrumbList (redundância adicional para alguns rastreadores) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@id": item.url,
              "name": item.label
            }
          }))
        })}
      </script>
    </>
  );
}
