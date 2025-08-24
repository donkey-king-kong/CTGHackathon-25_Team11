import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Languages, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PostGenerator } from "./PostGenerator";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  child_alias: string;
  region: string;
  language: string;
  text: string;
  media_urls: string[];
  media_types: string[];
  donors: string[];
  created_at: string;
  animation_type: string;
  type: string;
  school: string;
}

interface MessageLightboxProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  donorName: string;
}

export function MessageLightbox({
  message,
  isOpen,
  onClose,
  donorName,
}: MessageLightboxProps) {
  if (!message) return null;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleShare = async () => {
    const shareText = `"${message.text}" - A heartfelt thank you from ${message.child_alias}`;
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Thank you letter from ${message.child_alias}`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast.success("Message copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share message");
    }
  };

  const getDeliveryAnimation = () => {
    switch (message.animation_type) {
      case "plane":
        return {
          initial: { x: -200, y: -100, rotate: -45, opacity: 0 },
          animate: { x: 0, y: 0, rotate: 0, opacity: 1 },
          transition: { duration: 1.2, type: "spring" as const },
        };
      case "candy":
        return {
          initial: { scale: 0, rotate: 360, opacity: 0 },
          animate: { scale: 1, rotate: 0, opacity: 1 },
          transition: { duration: 0.8, type: "spring" as const },
        };
      case "heart":
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: [0, 1.2, 1], opacity: 1 },
          transition: { duration: 0.6 },
        };
      case "balloon":
        return {
          initial: { y: 100, opacity: 0 },
          animate: { y: [100, -10, 0], opacity: 1 },
          transition: { duration: 1, type: "spring" as const },
        };
      default:
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { duration: 0.4 },
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with floating elements */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Floating confetti */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {["✨", "🌟", "💫", "⭐", "🎈", "🎊"][i % 6]}
              </motion.div>
            ))}
          </motion.div>

          {/* Message Card */}
          <motion.div
            className="relative max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            {...getDeliveryAnimation()}
          >
            <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-2xl border-4 border-white p-8 relative">
              {/* Close and Share buttons */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="bg-white/80 hover:bg-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="bg-white/80 hover:bg-white"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Envelope opening animation */}
              <motion.div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -90 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="text-6xl">📮</div>
              </motion.div>

              {/* Child avatar placeholder */}
              <div className="text-center mb-6">
                <motion.div
                  className="inline-block text-8xl mb-4"
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🧒
                </motion.div>
                <h2 className="text-3xl font-bold text-brand-primary mb-2">
                  From: {message.child_alias}
                </h2>
                <div className="flex items-center justify-center gap-4 text-text-muted">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {message.region}
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {getTimeAgo(message.created_at)}
                  </div>
                </div>
              </div>

              {/* Message in handwriting style */}
              <motion.div
                className="bg-white rounded-lg p-8 shadow-inner border-2 border-dashed border-brand-primary/20 mb-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <p
                  className="text-xl leading-relaxed text-text"
                  style={{ fontFamily: "'Kalam', cursive" }}
                >
                  &quot;{message.text}&quot;
                </p>

                {/* Cute doodles around the text */}
                <div className="absolute top-2 right-4 text-2xl">🌈</div>
                <div className="absolute bottom-2 left-4 text-xl">⭐</div>
                <div className="absolute top-1/2 -right-2 text-lg">💖</div>
              </motion.div>

              {/* Media with polaroid style */}
              {message.media_urls.length > 0 && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  {message.media_urls.map((url, index) => {

                    const { data } = supabase.storage.from("message-media").getPublicUrl(url);

                    const publicUrl = data.publicUrl;

                    return(
                      <div key={index} className="relative">
                        <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
                          {message.media_types[index] === "image" ? (
                            <img
                              src={`${publicUrl}`}
                              alt="Child's drawing"
                              className="w-full h-64 object-cover rounded"
                            />
                          ) : (
                            <video
                              src={`${publicUrl}`}
                              className="w-full h-64 object-cover rounded"
                              controls
                              autoPlay
                              muted
                            />
                          )}
                          <div className="mt-2 text-center text-sm text-text-muted font-handwritten">
                            Made with love 💕
                          </div>
                        </div>
                      </div>
                  )})}
                </motion.div>
              )}

              {/* Tags and special message */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center items-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <Badge className="bg-brand-primary text-white">
                  <Languages className="h-3 w-3 mr-1" />
                  {message.language === "en"
                    ? "English"
                    : message.language === "zh"
                    ? "中文"
                    : "Mixed"}
                </Badge>

                {(message.donors?.length > 0) && (
                  <Badge className="bg-red-100 text-red-700 border border-red-200">
                    <Heart className="h-3 w-3 mr-1" />
                    Special message for: {donorName}
                  </Badge>
                )}

                <Badge
                  variant="outline"
                  className="bg-yellow-50 border-yellow-200"
                >
                  Delivered via {message.animation_type} ✨
                </Badge>
              </motion.div>

              {/* Footer message with Instagram generator */}
              <motion.div
                className="text-center mt-8 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <div className="p-4 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg">
                  <p className="text-brand-primary font-semibold text-lg">
                    Thank you for making a difference in {message.child_alias}
                    &apos;s life! 🌟
                  </p>
                </div>

                {/* Instagram Post Generator */}
                <div className="flex justify-center">
                  <PostGenerator message={message} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
