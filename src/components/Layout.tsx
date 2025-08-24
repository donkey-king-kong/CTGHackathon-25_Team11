import { ReachHeader } from "@/components/ReachHeader";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Use header layout for all pages (now showing header everywhere for consistent navigation)
  return (
    <div className="min-h-screen bg-background">
      <ReachHeader />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}