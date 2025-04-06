
import { useEffect, useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { Home, FolderOpen, MessageSquare, Users, LogOut, Edit, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    
    // Get admin email
    const email = localStorage.getItem("adminEmail");
    setAdminEmail(email);
    
    // Check for session timeout (optional - 2 hours)
    const loginTime = localStorage.getItem("adminLoginTime");
    if (loginTime) {
      const timeElapsed = Date.now() - parseInt(loginTime);
      const twoHoursInMs = 2 * 60 * 60 * 1000;
      
      if (timeElapsed > twoHoursInMs) {
        handleLogout();
        toast.info("Sua sessão expirou. Por favor, faça login novamente.");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminLoginTime");
    navigate("/admin");
    toast.success("Logout realizado com sucesso");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home size={18} /> },
    { name: "Gerenciar Conteúdo", path: "/admin/content", icon: <Edit size={18} /> },
    { name: "Portfólio", path: "/admin/portfolio", icon: <FolderOpen size={18} /> },
    { name: "Depoimentos", path: "/admin/depoimentos", icon: <MessageSquare size={18} /> },
    { name: "Contatos", path: "/admin/contatos", icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif font-bold text-xl tracking-tight">
              casa<span className="text-primary">branca</span>
            </span>
          </Link>
        </div>
        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t">
          {adminEmail && (
            <div className="flex items-center px-4 py-3 mb-4 bg-muted/50 rounded-md">
              <Shield size={16} className="text-primary mr-2" />
              <div className="truncate text-sm">
                <span className="block font-medium">Administrador</span>
                <span className="block text-xs text-muted-foreground truncate">{adminEmail}</span>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-3" />
            Sair
          </Button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif font-bold text-xl tracking-tight">
              casa<span className="text-primary">branca</span>
            </span>
          </Link>
          <div className="flex items-center space-x-2">
            {adminEmail && (
              <div className="hidden sm:block text-sm mr-2">
                <span className="text-xs text-muted-foreground">{adminEmail}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>
        <div className="px-2 py-3 flex border-t overflow-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center px-3 py-1 text-xs text-muted-foreground"
            >
              {item.icon}
              <span className="mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:p-8 p-4 pt-24 md:pt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
