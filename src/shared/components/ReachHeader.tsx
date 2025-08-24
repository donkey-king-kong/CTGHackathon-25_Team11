import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogIn, User, LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { useAuth } from "@/app/providers/contexts/AuthContext";

const navigation = [
  { name: "What We Do", href: "/what-we-do" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Messages", href: "/messages" },
  { name: "Festival 2026", href: "/festival" },
];

export function ReachHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <a 
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-reach-green to-reach-orange rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-reach-green font-bold text-lg hidden sm:block">
                PROJECT REACH
              </span>
            </a>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <motion.div
              className="flex items-center space-x-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-reach-green hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </a>
              ))}
            </motion.div>
          </nav>

          {/* Right Side - Auth & Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {!loading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-lg px-3 py-2 h-auto">
                          <User className="h-4 w-4 mr-2" />
                          <span className="text-sm">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => window.location.href = '/messages'}>
                          💌 My Letters
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      className="rounded-lg px-3 py-2 h-auto"
                      onClick={() => window.location.href = '/auth'}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      <span className="text-sm">Sign In</span>
                    </Button>
                  )}
                </>
              )}
              
              <Button
                className="bg-reach-orange hover:bg-reach-orange/90 text-white rounded-lg px-4 py-2 text-sm font-medium"
                onClick={() => window.location.href = '/donate'}
              >
                Donate
              </Button>
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6 text-reach-green" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3 pb-6 border-b border-gray-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-reach-green to-reach-orange rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">R</span>
                    </div>
                    <span className="text-reach-green font-bold text-xl">
                      PROJECT REACH
                    </span>
                  </div>

                  <nav className="flex flex-col space-y-1">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-base font-medium text-gray-700 hover:text-reach-green hover:bg-gray-50 rounded-lg px-3 py-2 transition-all duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </nav>

                  <div className="pt-6 space-y-3">
                    {!loading && (
                      <>
                        {user ? (
                          <>
                            <div className="bg-reach-green/10 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 text-reach-green">
                                <User className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full rounded-lg"
                              onClick={() => {
                                setIsOpen(false);
                                window.location.href = '/messages';
                              }}
                            >
                              💌 My Letters
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full rounded-lg text-red-600 hover:text-red-700"
                              onClick={() => {
                                setIsOpen(false);
                                handleSignOut();
                              }}
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign Out
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full rounded-lg"
                            onClick={() => {
                              setIsOpen(false);
                              window.location.href = '/auth';
                            }}
                          >
                            <LogIn className="h-4 w-4 mr-2" />
                            Sign In
                          </Button>
                        )}
                      </>
                    )}
                    
                    <Button
                      className="w-full bg-reach-orange hover:bg-reach-orange/90 text-white rounded-lg"
                      onClick={() => {
                        setIsOpen(false);
                        window.location.href = '/donate';
                      }}
                    >
                      Donate
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}