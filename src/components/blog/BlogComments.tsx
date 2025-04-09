import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, ThumbsUp, Calendar, Flag, MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface BlogCommentsProps {
  postSlug: string;
  title?: string;
}

export function BlogComments({ postSlug, title = "Comentários" }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  
  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        // Simulação de carregamento - em produção, isso seria uma API real
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dados de exemplo para demonstração
        if (postSlug === "como-planejar-uma-reforma-de-cozinha-completa") {
          setComments([
            {
              id: "1",
              name: "Ricardo Oliveira",
              email: "ricardo@exemplo.com",
              content: "Excelente artigo! Estou planejando reformar minha cozinha e essas dicas vieram em ótima hora. Especialmente a parte sobre o orçamento realista com a margem para imprevistos.",
              createdAt: "2024-04-15T14:30:00Z",
              likes: 3,
              replies: [
                {
                  id: "1-1",
                  name: "Elton Casabranca",
                  email: "elton@casabranca.com",
                  content: "Obrigado, Ricardo! Fico feliz que as dicas tenham sido úteis. Se precisar de alguma orientação específica sobre sua reforma, é só perguntar.",
                  createdAt: "2024-04-15T16:45:00Z",
                  likes: 1
                }
              ]
            },
            {
              id: "2",
              name: "Fernanda Santos",
              email: "fernanda@exemplo.com",
              content: "Adorei as dicas sobre materiais. Estava em dúvida entre granito e quartzo para a bancada, e agora tenho uma ideia melhor das vantagens de cada um. O checklist no final é muito útil!",
              createdAt: "2024-04-16T09:15:00Z",
              likes: 2
            }
          ]);
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
        toast.error("Não foi possível carregar os comentários");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComments();
  }, [postSlug]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Submit comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      name,
      email,
      content,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    
    // If replying to a comment
    if (replyingTo) {
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === replyingTo) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                newComment
              ]
            };
          }
          return comment;
        })
      );
      
      setReplyingTo(null);
    } else {
      // New top-level comment
      setComments(prev => [newComment, ...prev]);
    }
    
    // Reset form
    setName("");
    setEmail("");
    setContent("");
    setShowForm(false);
    
    toast.success("Comentário enviado com sucesso!");
  };
  
  // Like a comment
  const handleLikeComment = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === parentId && comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === commentId 
                  ? { ...reply, likes: reply.likes + 1 } 
                  : reply
              )
            };
          }
          return comment;
        })
      );
    } else {
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 } 
            : comment
        )
      );
    }
  };
  
  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        {title} ({comments.length})
      </h2>
      
      {/* Comment form toggle */}
      {!showForm && !replyingTo && (
        <Button 
          onClick={() => setShowForm(true)}
          className="mb-8"
        >
          Deixar um comentário
        </Button>
      )}
      
      {/* Comment form */}
      {(showForm || replyingTo) && (
        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-medium mb-4">
            {replyingTo ? "Responder comentário" : "Deixe seu comentário"}
          </h3>
          
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email (não será publicado)"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Comentário</Label>
              <Textarea 
                id="content" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva seu comentário aqui..."
                rows={4}
                required
              />
            </div>
            
            <div className="text-sm text-muted-foreground mb-4">
              Seu email não será publicado. Comentários são moderados antes de serem exibidos.
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setReplyingTo(null);
                }}
              >
                Cancelar
              </Button>
              
              <Button type="submit">
                Enviar comentário
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Comments list */}
      {isLoading ? (
        <div className="py-6 text-center text-muted-foreground">
          Carregando comentários...
        </div>
      ) : comments.length === 0 ? (
        <div className="py-6 text-center border rounded-lg bg-muted/20">
          <p className="mb-2 font-medium">Nenhum comentário ainda</p>
          <p className="text-muted-foreground">Seja o primeiro a comentar neste post</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex items-start">
                <div className="bg-primary/10 text-primary rounded-full p-2 mr-3">
                  <User className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h4 className="font-medium">{comment.name}</h4>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                  
                  <p className="mb-3">{comment.content}</p>
                  
                  <div className="flex items-center space-x-4 mt-2">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center text-sm text-muted-foreground hover:text-primary"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {comment.likes > 0 && <span>{comment.likes}</span>}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setReplyingTo(comment.id);
                        setShowForm(false);
                      }}
                      className="flex items-center text-sm text-muted-foreground hover:text-primary"
                    >
                      Responder
                    </button>
                    
                    <button className="flex items-center text-sm text-muted-foreground hover:text-destructive">
                      <Flag className="h-4 w-4 mr-1" />
                      Denunciar
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 mt-4 space-y-4 pl-4 border-l">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="bg-secondary/10 text-secondary rounded-full p-2 mr-3">
                          <User className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{reply.name}</h5>
                            
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(reply.createdAt)}
                            </div>
                          </div>
                          
                          <p className="text-sm">{reply.content}</p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            <button 
                              onClick={() => handleLikeComment(reply.id, true, comment.id)}
                              className="flex items-center text-xs text-muted-foreground hover:text-primary"
                            >
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {reply.likes > 0 && <span>{reply.likes}</span>}
                            </button>
                            
                            <button className="flex items-center text-xs text-muted-foreground hover:text-destructive">
                              <Flag className="h-3 w-3 mr-1" />
                              Denunciar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 