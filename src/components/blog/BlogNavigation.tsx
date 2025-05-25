
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BlogPost {
  slug: string;
  title: string;
  excerpt?: string;
}

interface BlogNavigationProps {
  previousPost?: BlogPost;
  nextPost?: BlogPost;
  showBackToBlog?: boolean;
}

export const BlogNavigation = ({
  previousPost,
  nextPost,
  showBackToBlog = true
}: BlogNavigationProps) => {
  return (
    <nav className="mt-12 mb-8">
      {/* Back to Blog */}
      {showBackToBlog && (
        <div className="mb-8 text-center">
          <Button asChild variant="outline">
            <Link to="/blog">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>
      )}

      {/* Previous/Next Navigation */}
      {(previousPost || nextPost) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Previous Post */}
          {previousPost ? (
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to={`/blog/${previousPost.slug}`} className="block">
                  <div className="flex items-start gap-3">
                    <ArrowLeft className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Post Anterior</p>
                      <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors">
                        {previousPost.title}
                      </h3>
                      {previousPost.excerpt && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {previousPost.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div /> // Empty space to maintain grid layout
          )}

          {/* Next Post */}
          {nextPost && (
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to={`/blog/${nextPost.slug}`} className="block">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 text-right">
                      <p className="text-sm text-muted-foreground mb-1">Próximo Post</p>
                      <h3 className="font-medium text-sm leading-tight hover:text-primary transition-colors">
                        {nextPost.title}
                      </h3>
                      {nextPost.excerpt && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {nextPost.excerpt}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </nav>
  );
};
