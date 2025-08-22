import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Plus, Upload } from "lucide-react";

export default function Admin() {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Donation form state
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");

  // Note form state
  const [noteContent, setNoteContent] = useState("");
  const [noteDonorName, setNoteDonorName] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Success", description: "Logged in successfully!" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`
          }
        });
        if (error) throw error;
        toast({ title: "Success", description: "Account created! Please check your email." });
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Success", description: "Signed out successfully!" });
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('donations').insert({
        donor_name: donorName,
        amount: parseFloat(amount),
        region_id: null, // Will need region lookup
        lives_impacted: Math.floor(parseFloat(amount) / 100),
        donor_id: `donor_${Date.now()}`, // Simple ID generation
      });

      if (error) throw error;

      toast({ title: "Success", description: "Donation record added successfully!" });
      
      // Reset form
      setDonorName("");
      setAmount("");
      setRegion("");
      setDescription("");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('notes').insert({
        content: noteContent,
        donor_name: noteDonorName,
        beneficiary_name: beneficiaryName,
        donor_id: `donor_${Date.now()}`, // Simple ID generation
      });

      if (error) throw error;

      toast({ title: "Success", description: "Impact note added successfully!" });
      
      // Reset form
      setNoteContent("");
      setNoteDonorName("");
      setBeneficiaryName("");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message,
        variant: "destructive" 
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto p-3 bg-primary/20 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Admin Portal</CardTitle>
              <CardDescription>
                {isLogin ? "Sign in to manage REACH data" : "Create an admin account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Need to create an account?" : "Already have an account?"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
          <p className="text-muted-foreground">Manage donation records and impact stories</p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="donations">Add Donations</TabsTrigger>
          <TabsTrigger value="notes">Add Impact Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="donations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Donation Record
              </CardTitle>
              <CardDescription>
                Add new donation records to track donor impact and contributions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDonation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donor-name">Donor Name</Label>
                    <Input
                      id="donor-name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g., Central, Wan Chai, Tsim Sha Tsui"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional notes about this donation..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Add Donation Record
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Impact Note
              </CardTitle>
              <CardDescription>
                Add heartfelt messages and stories from beneficiaries to showcase donor impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <Label htmlFor="note-content">Impact Story</Label>
                  <Textarea
                    id="note-content"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Share a story about how donations have made a difference..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="note-donor-name">Donor Name (Optional)</Label>
                    <Input
                      id="note-donor-name"
                      value={noteDonorName}
                      onChange={(e) => setNoteDonorName(e.target.value)}
                      placeholder="If this story is for a specific donor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="beneficiary-name">Beneficiary Name</Label>
                    <Input
                      id="beneficiary-name"
                      value={beneficiaryName}
                      onChange={(e) => setBeneficiaryName(e.target.value)}
                      placeholder="Name of the child or person sharing this story"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Add Impact Note
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}