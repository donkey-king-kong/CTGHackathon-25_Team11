import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Heart, MapPin, Calendar, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { MessageAnimation } from "./MessageAnimation";
import { supabase } from "@/infrastructure/supabase/client";

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
}

interface PersonalizedMessageCardProps {
  message: Message;
  onOpen: (message: Message) => void;
  index: number;
  donorName?: string;
}

// Use the same color palette as MessageCard for consistency
const cardColors = [
  "from-pink-50 to-pink-100",
  "from-blue-50 to-blue-100", 
  "from-yellow-50 to-yellow-100",
  "from-green-50 to-green-100",
  "from-purple-50 to-purple-100",
  "from-orange-50 to-orange-100",
];

export function PersonalizedMessageCard({
  message,
  onOpen,
  index,
  donorName,
}: PersonalizedMessageCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  const colorClass = cardColors[index % cardColors.length];

  return (
    <MessageAnimation
      animationType={message.animation_type || "letterbox"}
      isHovered={isHovered}
      onClick={() => onOpen(message)}
      delay={index * 0.1}
    >
      <Card
        className={`group hover:shadow-elevated transition-all duration-300 bg-gradient-to-br ${colorClass} border-0 overflow-hidden relative`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Personal Message Indicator */}
        <div className="absolute top-3 right-3 z-10">
          <Heart className="h-5 w-5 text-red-500 fill-current animate-pulse" />
        </div>

        <CardContent className="p-6">
          {/* Media Preview with Doodle Frame */}
          {message.media_urls.length > 0 && (
            <motion.div
              className="mb-4 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-lg overflow-hidden border-4 border-white shadow-md transform rotate-1">
                {(() => {
                  const { data } = supabase.storage
                    .from("message-media")
                    .getPublicUrl(message.media_urls[0]);
                  const publicUrl = data.publicUrl;

                  return message.media_types[0] === "image" ? (
                    <img
                      src={publicUrl}
                      alt="Child's drawing"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <video
                      src={publicUrl}
                      className="w-full h-40 object-cover"
                      poster=""
                      controls
                    />
                  );
                })()}
              </div>

              {/* Doodle decorations */}
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                ⭐
              </div>
              <div className="absolute -bottom-1 -left-2 text-xl">🌈</div>
            </motion.div>
          )}

          {/* Message Content in Handwriting Style */}
          <div className="space-y-3">
            <motion.p
              className="text-text leading-relaxed font-handwritten text-lg overflow-hidden"
              style={{
                fontFamily: "'Kalam', cursive",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical" as const,
              }}
              whileHover={{ scale: 1.02 }}
            >
              &quot;{message.text}&quot;
            </motion.p>

            <div className="pt-2 border-t border-white/50">
              <motion.p
                className="font-bold text-brand-primary text-lg"
                whileHover={{ color: "#FF6B35" }}
              >
                — {message.child_alias} 🌟
              </motion.p>

              <p className="text-sm text-text-muted flex items-center mt-2">
                <MapPin className="h-3 w-3 mr-1" />
                {message.region}
              </p>
            </div>

            {/* Tags with cute styling */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge
                variant="secondary"
                className="text-xs bg-white/70 text-brand-primary border border-brand-primary/20"
              >
                <Languages className="h-3 w-3 mr-1" />
                {message.language === "en"
                  ? "English"
                  : message.language === "zh"
                  ? "中文"
                  : "Mixed"}
              </Badge>

              {/* Personalized Badge */}
              <Badge
                variant="outline"
                className="text-xs bg-pink-100 text-pink-600 border-pink-200"
              >
                💖 For {donorName || "You"}
              </Badge>

              <Badge
                variant="outline"
                className="text-xs bg-white/50 text-text-muted border-text-muted/20 flex items-center"
              >
                <Calendar className="h-3 w-3 mr-1" />
                {getTimeAgo(message.created_at)}
              </Badge>
            </div>

            {/* Hover hint */}
            <motion.div
              className="text-center text-xs text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity mt-3"
              animate={isHovered ? { y: -2 } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            ></motion.div>
          </div>
        </CardContent>
      </Card>
    </MessageAnimation>
  );
}
