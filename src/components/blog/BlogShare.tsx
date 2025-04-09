import { Copy, Facebook, Linkedin, Send, Share2, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BlogShareProps {
  url: string;
  title: string;
  description?: string;
}

export function BlogShare({ url, title, description }: BlogShareProps) {
  // Ensure we have the full URL
  const fullUrl = url.startsWith('http') ? url : `https://www.casabrancareformas.com.br${url}`;
  
  // Encode parameters for sharing
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description ? encodeURIComponent(description) : encodedTitle;
  
  // Share URLs
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
  
  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl)
      .then(() => toast.success("Link copiado para a área de transferência"))
      .catch(() => toast.error("Erro ao copiar link"));
  };
  
  // Share via navigator share API if available
  const shareNative = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: description || title,
        url: fullUrl
      })
      .catch(error => console.error("Erro ao compartilhar:", error));
    } else {
      copyToClipboard();
    }
  };
  
  return (
    <div className="my-6 py-4 border-y">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <h3 className="font-medium text-muted-foreground flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Native share (mobile) */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-3 sm:hidden" 
            onClick={shareNative}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
          
          {/* Social buttons */}
          <a 
            href={twitterUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex"
          >
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Compartilhar no Twitter</span>
            </Button>
          </a>
          
          <a 
            href={facebookUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex"
          >
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Compartilhar no Facebook</span>
            </Button>
          </a>
          
          <a 
            href={linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex"
          >
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Compartilhar no LinkedIn</span>
            </Button>
          </a>
          
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex"
            aria-label="Compartilhar no WhatsApp"
          >
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                <path d="M9.5 13.5c.5 1.5 2.5 2 4 1" />
              </svg>
              <span className="sr-only">Compartilhar no WhatsApp</span>
            </Button>
          </a>
          
          <a 
            href={telegramUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex"
          >
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Send className="h-4 w-4" />
              <span className="sr-only">Compartilhar no Telegram</span>
            </Button>
          </a>
          
          <a 
            href={emailUrl} 
            className="inline-flex"
          >
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="sr-only">Compartilhar por Email</span>
            </Button>
          </a>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copiar link</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 