import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Heart, User, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Context-based messaging for different user types
const getContextualContent = (context: string) => {
  switch (context) {
    case 'messages':
      return {
        icon: '🔒',
        title: 'Sign in to view your personal letters',
        description: 'Your personal thank you letters from children are waiting for you. Sign in to read heartfelt messages addressed specifically to you.',
        signInButton: 'Sign In to View',
        signUpTitle: 'Create Account to View Letters'
      };
    case 'admin':
      return {
        icon: '🛡️',
        title: 'Admin Access Required',
        description: 'Sign in to access moderation tools and manage thank you messages.',
        signInButton: 'Sign In as Admin',
        signUpTitle: 'Create Admin Account'
      };
    case 'recipient':
      return {
        icon: '💌',
        title: 'Welcome, Young Writer!',
        description: 'Sign in to share your thank you messages with kind donors.',
        signInButton: 'Sign In to Share',
        signUpTitle: 'Create Account to Share'
      };
    default: // donor context
      return {
        icon: '💌',
        title: 'Welcome to your letterbox',
        description: 'Sign in to read personal thank you letters from children',
        signInButton: 'Sign In to Read Letters',
        signUpTitle: 'Create Account for Letters'
      };
  }
};

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("donor");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [region, setRegion] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [context, setContext] = useState("donor");

  useEffect(() => {
    // Get context from URL parameters or referrer
    const urlParams = new URLSearchParams(window.location.search);
    const contextParam = urlParams.get('context');
    const referrer = document.referrer;
    
    if (contextParam) {
      setContext(contextParam);
    } else if (referrer.includes('/messages')) {
      setContext('messages');
    } else if (referrer.includes('/admin')) {
      setContext('admin');
    } else if (referrer.includes('/messages-upload')) {
      setContext('recipient');
    }
  }, []);

  const contextContent = getContextualContent(context);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      // Redirect based on user role or to messages
      setTimeout(() => {
        window.location.href = "/messages";
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword || !fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (role === "organisation" && !organizationName) {
      toast.error("Organization name is required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/messages`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
            phone: phone,
            organization_name: organizationName,
            region: region
          }
        }
      });

      if (error) throw error;

      toast.success("Account created! Please check your email to verify your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50 flex items-center justify-center p-6">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            initial={{ y: "100vh", x: `${Math.random() * 100}vw` }}
            animate={{ y: "-20vh" }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {["💌", "❤️", "🌟", "📮", "🎈"][i % 5]}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {contextContent.icon}
            </motion.div>
            <CardTitle className="text-2xl font-bold text-brand-primary">
              {contextContent.title}
            </CardTitle>
            <CardDescription className="text-text-muted">
              {contextContent.description}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : contextContent.signInButton}
                    <Heart className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Role *</label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">Donor - I want to support children</SelectItem>
                        <SelectItem value="recipient">Recipient - I'm benefiting from donations</SelectItem>
                        <SelectItem value="organisation">Organisation - I manage donations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                      <Input
                        type="tel"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {role === "organisation" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-text">Organization Name *</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Your organization name"
                          value={organizationName}
                          onChange={(e) => setOrganizationName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Region</label>
                    <Input
                      type="text"
                      placeholder="Your region/location"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-secondary hover:bg-brand-secondary-dark text-white"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : contextContent.signUpTitle}
                    <Heart className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/messages"}
                className="text-text-muted hover:text-brand-primary"
              >
                ← Back to public letters
              </Button>
            </div>
          </CardContent>
        </Card>

        <motion.div
          className="text-center mt-6 text-text-muted text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your personal letters from children are waiting! 💕
        </motion.div>
      </motion.div>
    </div>
  );
}