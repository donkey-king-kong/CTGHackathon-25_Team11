import { ReachHeader } from "@/components/ReachHeader";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Use header layout for all pages
  return (
    <div className="min-h-screen bg-background">
      {!isHomePage && <ReachHeader />}
      <main className={isHomePage ? "" : "pt-16"}>
        {children}
      </main>
    </div>
  );
}