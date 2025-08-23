import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Calendar,
  Languages,
  Lock,
  Users,
  Share2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { LetterboxHero } from "@/components/messages/LetterboxHero";
import { MessageCard } from "@/components/messages/MessageCard";
import { PersonalizedMessageCard } from "@/components/messages/PersonalizedMessageCard";
import { MessageLightbox } from "@/components/messages/MessageLightbox";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Message {
  id: string;
  child_alias: string;
  region: string;
  language: string;
  text: string;
  media_urls: string[];
  media_types: string[];
  created_at: string;
  animation_type: string;
  donors: string[];
  type: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all-regions");
  const [languageFilter, setLanguageFilter] = useState<string>("all-languages");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<"public" | "personal">("public");

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    fetchMessages();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchQuery, regionFilter, languageFilter, currentTab, user]);

  const fetchMessages = async () => {
    try {
      let query = supabase
        .from("messages")
        .select("*")
        .eq("type", "general")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      // console.log(data)
      setMessages(
        (data || []).map((msg) => ({
          ...msg,
          media_urls: Array.isArray(msg.media_urls)
            ? msg.media_urls.map((url) => String(url))
            : [],
          media_types: Array.isArray(msg.media_types)
            ? msg.media_types.map((type) => String(type))
            : [],
        }))
      );
      // console.log(messages)
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // Filter by message type (public vs personal)
    if (currentTab === "personal") {
      // Fetch messsages tagged to this specific user and general messages
      filtered = filtered.filter(
        (message) => user && (message.donors.includes(user.id) || message.donors.length == 0)
      );
    } else {
      // Show only general messages
      filtered = filtered.filter((message) => message.donors.length == 0);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (message) =>
          message.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          message.child_alias.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (regionFilter && regionFilter !== "all-regions") {
      filtered = filtered.filter((message) => message.region === regionFilter);
    }

    if (languageFilter && languageFilter !== "all-languages") {
      filtered = filtered.filter(
        (message) => message.language === languageFilter
      );
    }

    setFilteredMessages(filtered);
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsLightboxOpen(true);
  };

  const closeMessage = () => {
    setSelectedMessage(null);
    setIsLightboxOpen(false);
  };

  const handleShareMessage = async (message: Message) => {
    try {
      await navigator.share({
        title: `Thank you letter from ${message.child_alias}`,
        text: `"${message.text.substring(
          0,
          100
        )}..." - A heartfelt message from a child`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `Check out this heartfelt thank you letter: "${message.text}" - From ${message.child_alias} at ${window.location.href}`
      );
      toast.success("Message link copied to clipboard!");
    }
  };

  const handleSignIn = () => {
    window.location.href = "/auth?context=messages";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-lg">Opening your letterbox...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
        {/* Letterbox Hero */}
        <LetterboxHero messageCount={filteredMessages.length} />

        {/* Message Type Tabs */}
        <section className="py-6 bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-white/50">
          <div className="container mx-auto px-6">
            <Tabs
              value={currentTab}
              onValueChange={(value) =>
                setCurrentTab(value as "public" | "personal")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="public" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Public Letters
                </TabsTrigger>
                <TabsTrigger
                  value="personal"
                  className="flex items-center gap-2"
                >
                  {user ? (
                    <Heart className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  For You
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Filters - Floating and Magical */}
        <section className="py-8 bg-white/70 backdrop-blur-sm sticky top-16 z-10 shadow-sm border-b border-white/50">
          <div className="container mx-auto px-6">
            <motion.div
              className="flex flex-col md:flex-row gap-4 items-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
                <Input
                  placeholder="Search letters by message, name, or school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/90 border-brand-primary/20 focus:border-brand-primary"
                />
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-48 bg-white/90 border-brand-primary/20">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-regions">All Regions</SelectItem>
                    <SelectItem value="Central & Western">
                      Central & Western
                    </SelectItem>
                    <SelectItem value="Eastern">Eastern</SelectItem>
                    <SelectItem value="Southern">Southern</SelectItem>
                    <SelectItem value="Wan Chai">Wan Chai</SelectItem>
                    <SelectItem value="Kowloon City">Kowloon City</SelectItem>
                    <SelectItem value="Kwun Tong">Kwun Tong</SelectItem>
                    <SelectItem value="Sham Shui Po">Sham Shui Po</SelectItem>
                    <SelectItem value="Wong Tai Sin">Wong Tai Sin</SelectItem>
                    <SelectItem value="Yau Tsim Mong">Yau Tsim Mong</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={languageFilter}
                  onValueChange={setLanguageFilter}
                >
                  <SelectTrigger className="w-48 bg-white/90 border-brand-primary/20">
                    <Languages className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-languages">All Languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Messages Letterbox Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            {/* Show sign-in prompt for personal tab when not authenticated */}
            {currentTab === "personal" && !user ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-8xl mb-6">🔒</div>
                <h3 className="text-2xl font-semibold mb-4 text-brand-primary">
                  Sign in to view letters addressed to you!
                </h3>
                <Button
                  className="bg-brand-primary hover:bg-brand-primary-dark text-white"
                  onClick={handleSignIn}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In to View
                </Button>
              </motion.div>
            ) : filteredMessages.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {filteredMessages.map((message, index) =>
                  currentTab === "personal" && message.donors ? (
                    <PersonalizedMessageCard
                      key={message.id}
                      message={message}
                      onOpen={openMessage}
                      index={index}
                      donorName={user?.id?.split("@")[0] || "You"}
                    />
                  ) : (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onOpen={openMessage}
                      index={index}
                    />
                  )
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {user && user.role == 'admin' && (
          <motion.section
          className="py-20 bg-gradient-to-r from-brand-primary to-brand-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="container mx-auto px-6 text-center">
              <div className="max-w-2xl mx-auto text-white">
                <motion.div
                  className="text-6xl mb-6"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  💌
                </motion.div>
                <h2 className="text-3xl font-bold mb-6">
                  Add Your Letter to the Collection
                </h2>
                <p className="text-lg mb-8 opacity-90">
                  Help us inspire more support by sharing a thank you letter from
                  your school or child.
                </p>
                <Button
                  size="lg"
                  className="bg-white text-brand-primary hover:bg-surface px-8 py-3 rounded-full font-semibold"
                  onClick={() => (window.location.href = "/messages/new")}
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Write a Letter
                </Button>
              </div>
            </div>
          </motion.section>
          )
        }
        

      {/* Message Lightbox */}
      <MessageLightbox
        message={selectedMessage}
        isOpen={isLightboxOpen}
        onClose={closeMessage}
      />

    </div>
    </>

  );
}
