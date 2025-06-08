
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, User } from "lucide-react"; 

// Admin credentials - in a production app, these would be stored securely on a backend
const ADMIN_USERNAME = "user1";
const ADMIN_PASSWORD = "casabranca1";

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate admin credentials
    setTimeout(() => {
      if (
        formData.username === ADMIN_USERNAME &&
        formData.password === ADMIN_PASSWORD
      ) {
        // Store auth status in localStorage (in a real app, use more secure methods)
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminUsername", formData.username);
        localStorage.setItem("adminLoginTime", Date.now().toString());
        
        navigate("/admin/dashboard");
        toast.success("Login bem-sucedido!");
      } else {
        toast.error("Credenciais inválidas", {
          description: "Apenas o administrador pode acessar esta área.",
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username" className="flex items-center gap-2">
          <User size={16} />
          Usuário
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          placeholder="Digite seu usuário"
          required
          className="bg-background"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock size={16} />
            Senha
          </Label>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="bg-background"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Área restrita apenas para administradores
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
