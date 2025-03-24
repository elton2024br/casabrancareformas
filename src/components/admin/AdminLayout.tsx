
import { useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { Home, FolderOpen, MessageSquare, Users, LogOut, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin");
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
      <div className="w-64 bg-white border-r flex-shrink-0 hidden md:block">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-serif font-bold text-xl tracking-tight">
              casa<span className="text-primary">branca</span>
            </span>
          </Link>
        </div>
        <nav className="p-4">
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
        <div className="absolute bottom-8 left-4 right-4">
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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
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
