
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock credentials - in a real app, these would be validated securely on a backend
const MOCK_EMAIL = "admin@casabrancareformas.com";
const MOCK_PASSWORD = "admin123";

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      if (
        formData.email === MOCK_EMAIL &&
        formData.password === MOCK_PASSWORD
      ) {
        // Store auth status in localStorage (in a real app, use secure auth token)
        localStorage.setItem("adminAuthenticated", "true");
        navigate("/admin/dashboard");
        toast.success("Login bem-sucedido!");
      } else {
        toast.error("Credenciais inválidas", {
          description: "Verifique seu email e senha.",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <a
            href="#"
            className="text-sm font-medium text-primary hover:underline"
          >
            Esqueceu a senha?
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
      
      {/* Hint for demo purposes */}
      <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
        <p className="font-medium">Credenciais de demonstração:</p>
        <p>Email: admin@casabrancareformas.com</p>
        <p>Senha: admin123</p>
      </div>
    </form>
  );
};

export default LoginForm;
