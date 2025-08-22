import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 bg-transparent">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white" />
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-lg text-white">PROJECT REACH</span>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-6 text-white">
        <Link to="/festival" className="hover:text-primary transition-colors">
          Children's Character Festival 2026
        </Link>
        <Link to="/what-we-do" className="hover:text-primary transition-colors">
          What We Do
        </Link>
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Our Impacts
        </Link>
        <Link to="/about" className="hover:text-primary transition-colors">
          About Us
        </Link>
        <Link to="/donate" className="hover:text-primary transition-colors">
          Donate
        </Link>
      </nav>
      
      <div className="flex items-center gap-3 md:hidden">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="text-white">
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
}