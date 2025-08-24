import { useState, useEffect, useRef } from "react";
import { Search, Filter, Heart, MapPin, Languages, Lock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { LetterboxHero } from "@/components/messages/LetterboxHero";
import { LettersPopup } from "@/components/messages/LettersPopup";
import { MessageCard } from "@/components/messages/MessageCard";
import { PersonalizedMessageCard } from "@/components/messages/PersonalizedMessageCard";
import { MessageLightbox } from "@/components/messages/MessageLightbox";
import { motion } from "framer-motion";
import { toast } from "sonner";

/** Back-compat message shape: supports both old (donors[]) and new (donor_tag) */
interface Message {
  id: string;
  child_alias: string;
  text: string;
  school?: string;
  region?: string;
  language?: string;
  media_urls?: string[];
  media_types?: string[];
  donors?: string[] | null;      // OLD schema: user IDs array
  donor_tag?: string | null;     // NEW schema: email string
  status?: string | null;
  created_at?: string;
  animation_type?: string;
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

  // Popup + scroll
  const [showLettersPopup, setShowLettersPopup] = useState(false);
  const lettersRef = useRef<HTMLDivElement | null>(null);

  /** Helpers to unify old/new schemas */
  const isPublic = (m: Message) => {
    const hasDonors = Array.isArray(m.donors) && m.donors.length > 0;
    const hasDonorTag = !!(m.donor_tag && m.donor_tag.trim());
    return !hasDonors && !hasDonorTag; // public when neither is set
  };

  const isPersonalFor = (m: Message, email?: string, userId?: string) => {
    const byArray = Array.isArray(m.donors) && userId ? m.donors.includes(userId) : false;
    const byTag = email ? m.donor_tag?.trim() === email : false;
    return byArray || byTag;
  };

  // Auth effect
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    fetchMessages();

    return () => subscription.unsubscribe();
  }, []);

  // Re-filter when inputs change
  useEffect(() => {
    filterMessages();
  }, [messages, searchQuery, regionFilter, languageFilter, currentTab, user]);

  // Popup handlers
  const openPersonalLetters = () => {
    setCurrentTab("personal");
    setShowLettersPopup(true);
  };

  const handleOpenLettersCTA = () => {
    setShowLettersPopup(false);
    setCurrentTab("personal");
    setTimeout(() => {
      lettersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  // Load messages (approved OR legacy null status)
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or("status.is.null,status.eq.approved") // include legacy rows without status
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMessages(
        (data || []).map((msg: any) => ({
          ...msg,
          media_urls: Array.isArray(msg.media_urls) ? msg.media_urls.map((u: unknown) => String(u)) : [],
          media_types: Array.isArray(msg.media_types) ? msg.media_types.map((t: unknown) => String(t)) : [],
          donors: Array.isArray(msg.donors) ? msg.donors.map(String) : (msg.donors ?? null),
          donor_tag: typeof msg.donor_tag === "string" ? msg.donor_tag.trim() : (msg.donor_tag ?? null),
        }))
      );

      // Optional debug once:
      // console.log("raw messages:", data?.length ?? 0);
      // if (user) {
      //   console.log("personal for me:", data.filter((m: any) => isPersonalFor(m, user.email, user.id)).length);
      // }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (currentTab === "personal") {
      filtered = filtered.filter((m) => user && isPersonalFor(m, user.email, user.id));
    } else {
      filtered = filtered.filter((m) => isPublic(m));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((m) =>
        (m.text ?? "").toLowerCase().includes(q) ||
        (m.child_alias ?? "").toLowerCase().includes(q) ||
        (m.school ?? "").toLowerCase().includes(q) ||
        (m.donor_tag ?? "").toLowerCase().includes(q)
      );
    }

    if (regionFilter && regionFilter !== "all-regions") {
      filtered = filtered.filter((m) => (m.region ?? "") === regionFilter);
    }
    if (languageFilter && languageFilter !== "all-languages") {
      filtered = filtered.filter((m) => (m.language ?? "") === languageFilter);
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

  const handleSignIn = () => {
    window.location.href = "/auth?context=messages";
  };

  // Count for popup label
  const personalCount = user
    ? messages.filter((m) => isPersonalFor(m, user.email, user.id)).length
    : 0;

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
        {/* Hero (clickable counter opens popup) */}
        <LetterboxHero
          messageCount={filteredMessages.length}
          onCountClick={openPersonalLetters}
        />

        {/* Tabs */}
        <section className="py-6 bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-white/50">
          <div className="container mx-auto px-6">
            <Tabs
              value={currentTab}
              onValueChange={(v) => setCurrentTab(v as "public" | "personal")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="public" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Public Letters
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  {user ? <Heart className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  For You
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Filters */}
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

              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-48 bg-white/90 border-brand-primary/20">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-regions">All Regions</SelectItem>
                  <SelectItem value="Central & Western">Central & Western</SelectItem>
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

              <Select value={languageFilter} onValueChange={setLanguageFilter}>
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

              <div className="flex items-center gap-2 text-text-muted bg-white/60 px-3 py-2 rounded-lg">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">{filteredMessages.length} letters</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Messages */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            {currentTab === "personal" && !user ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-8xl mb-6">🔒</div>
                <h3 className="text-2xl font-semibold mb-4 text-brand-primary">
                  Sign in to view your personal letters
                </h3>
                <p className="text-text-muted max-w-md mx-auto mb-6">
                  Your personal thank you letters from children are waiting for you. Sign in to read heartfelt messages addressed specifically to you.
                </p>
                <Button
                  className="bg-brand-primary hover:bg-brand-primary-dark text-white"
                  onClick={() => (window.location.href = "/auth?context=messages")}
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
                <div className="text-8xl mb-6">📭</div>
                <h3 className="text-2xl font-semibold mb-4 text-brand-primary">
                  {currentTab === "personal" ? "No personal letters yet" : "Your letterbox is empty"}
                </h3>
                <p className="text-text-muted max-w-md mx-auto mb-6">
                  {currentTab === "personal"
                    ? "No children have written personal thank you letters to you yet. Keep supporting and they will come!"
                    : searchQuery || regionFilter !== "all-regions" || languageFilter !== "all-languages"
                      ? "Try adjusting your filters to discover more heartfelt letters."
                      : "Be the first to inspire a child to share their gratitude!"
                  }
                </p>
                <Button
                  className="bg-brand-secondary hover:bg-brand-secondary-dark text-white"
                  onClick={() => (window.location.href = "/messages/new")}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Encourage a Letter
                </Button>
              </motion.div>
            ) : (
              <div ref={lettersRef}>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {filteredMessages.map((message, index) =>
                    currentTab === "personal" && isPersonalFor(message, user?.email, user?.id) ? (
                      <PersonalizedMessageCard
                        key={message.id}
                        message={message}
                        onOpen={openMessage}
                        index={index}
                        donorName={user?.email?.split("@")[0] || "You"}
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
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lightbox */}
      <MessageLightbox
        message={selectedMessage}
        isOpen={isLightboxOpen}
        onClose={closeMessage}
      />

      {/* Popup */}
      <LettersPopup
        open={showLettersPopup}
        onOpenChange={setShowLettersPopup}
        onOpenLetters={handleOpenLettersCTA}
        count={personalCount || filteredMessages.length}
      />
    </>
  );
}
