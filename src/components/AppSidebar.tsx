import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Heart, 
  BarChart3, 
  StickyNote, 
  DollarSign, 
  Info,
  Shield,
  Calendar,
  GraduationCap,
  Mail
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "💌 Your Letters", url: "/messages", icon: Mail },
  { title: "Children's Character Festival 2026", url: "/festival", icon: Calendar },
  { title: "What We Do", url: "/what-we-do", icon: GraduationCap },
  { title: "Our Impacts", url: "/dashboard", icon: BarChart3 },
  { title: "About Us", url: "/about", icon: Info },
  { title: "Impact Stories", url: "/stories", icon: StickyNote },
  { title: "Donate", url: "/donate", icon: Heart },
];

const adminItems = [
  { title: "Admin Portal", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium" 
      : "text-muted-foreground hover:bg-primary/5 hover:text-primary";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-primary font-bold px-3 py-2">
            PROJECT REACH
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wide text-muted-foreground px-3 py-2">
            Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}