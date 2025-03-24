
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Star, StarOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Testimonial } from "@/components/ui/testimonial-card";

// Mock data for testimonials
const initialTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Ana Oliveira",
    role: "Proprietária",
    content: "A Casa Branca transformou completamente meu apartamento. O processo foi transparente e o resultado superou minhas expectativas. Recomendo sem hesitar!",
    rating: 5,
  },
  {
    id: "2",
    name: "Carlos Silva",
    company: "Empresa XYZ",
    content: "Contratamos a Casa Branca para a reforma do nosso escritório e ficamos impressionados com a atenção aos detalhes e a qualidade do trabalho entregue dentro do prazo.",
    rating: 5,
  },
  {
    id: "3",
    name: "Fernanda Santos",
    role: "Designer de Interiores",
    content: "Como profissional da área, fico sempre atenta à qualidade das reformas. A Casa Branca executa com primor, respeita o projeto e sugere melhorias que fazem toda a diferença.",
    rating: 5,
  },
];

const AdminDepoimentos = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Testimonial>({
    id: "",
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });
  const [isAddMode, setIsAddMode] = useState(false);

  const handleEdit = (testimonial: Testimonial) => {
    setFormData(testimonial);
    setEditing(testimonial.id);
    setIsAddMode(false);
  };

  const handleDelete = (id: string) => {
    setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id));
    toast.success("Depoimento removido com sucesso!");
  };

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      name: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
    });
    setIsAddMode(true);
    setEditing(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAddMode) {
      setTestimonials([...testimonials, formData]);
      toast.success("Depoimento adicionado com sucesso!");
    } else if (editing) {
      setTestimonials(
        testimonials.map((testimonial) =>
          testimonial.id === editing ? formData : testimonial
        )
      );
      toast.success("Depoimento atualizado com sucesso!");
    }
    
    setEditing(null);
    setIsAddMode(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsAddMode(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gerenciar Depoimentos</h1>
          <p className="text-muted-foreground">
            Adicione, edite ou remova depoimentos de clientes
          </p>
        </div>
        <Button className="mt-4 md:mt-0" onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Depoimento
        </Button>
      </div>

      {(editing || isAddMode) && (
        <Card className="border-primary/50 shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Cliente</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Ana Oliveira"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo/Função (opcional)</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role || ""}
                    onChange={handleChange}
                    placeholder="Ex: Proprietária"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (opcional)</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  placeholder="Ex: Empresa XYZ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Depoimento</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="O que o cliente disse sobre nosso serviço..."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Avaliação</Label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      {star <= (formData.rating || 0) ? (
                        <Star className="h-6 w-6 fill-primary text-primary" />
                      ) : (
                        <StarOff className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {isAddMode ? "Adicionar" : "Atualizar"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (testimonial.rating || 0)
                          ? "fill-primary text-primary"
                          : "text-muted stroke-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEdit(testimonial)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive border-destructive/50 hover:border-destructive"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <blockquote className="italic text-muted-foreground line-clamp-4 mb-4">
                "{testimonial.content}"
              </blockquote>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                {(testimonial.role || testimonial.company) && (
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                    {testimonial.role && testimonial.company && ", "}
                    {testimonial.company}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Testimonial Card */}
        {!isAddMode && !editing && (
          <Card
            className="overflow-hidden border-dashed cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleAddNew}
          >
            <CardContent className="p-6 flex items-center justify-center h-full">
              <div className="text-center">
                <Plus className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <h3 className="font-medium">Adicionar Novo Depoimento</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique para adicionar um novo depoimento de cliente
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDepoimentos;
