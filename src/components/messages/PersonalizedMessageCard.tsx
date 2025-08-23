import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Share2, Star } from "lucide-react";
import { motion } from "framer-motion";

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
}

interface PersonalizedMessageCardProps {
  message: Message;
  onOpen: (message: Message) => void;
  index: number;
  donorName?: string;
}

export function PersonalizedMessageCard({
  message,
  onOpen,
  index,
  donorName,
}: PersonalizedMessageCardProps) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const gradients = [
    "bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100",
    "bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100",
    "bg-gradient-to-br from-green-100 via-emerald-50 to-blue-100",
    "bg-gradient-to-br from-yellow-100 via-orange-50 to-red-100",
    "bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={() => onOpen(message)}
    >
      <Card
        className={`${
          gradients[index % gradients.length]
        } border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
      >
        {/* Personalized Header */}
        <div className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <span className="text-sm font-medium">Personal Message</span>
            </div>
            <Badge className="bg-white/20 text-white border-0 text-xs">
              For {donorName || "You"}
            </Badge>
          </div>
          <p className="text-xs opacity-90">
            A special thank you letter addressed just to you
          </p>
        </div>

        {/* Media Preview */}
        {message.media_urls && message.media_urls.length > 0 && (
          <div className="relative h-32 overflow-hidden">
            {message.media_types[0]?.startsWith("video") ? (
              <video
                src={message.media_urls[0]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ transform: `rotate(${((index % 3) - 1) * 2}deg)` }}
              />
            ) : (
              <img
                src={message.media_urls[0]}
                alt="Child's artwork or photo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={{ transform: `rotate(${((index % 3) - 1) * 2}deg)` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <CardContent className="p-6 space-y-4">
          {/* Message Preview */}
          <div className="relative">
            <p className="text-base leading-relaxed font-handwriting text-gray-800 line-clamp-4 group-hover:text-primary transition-colors duration-200">
              "{message.text}"
            </p>
            <div className="absolute -top-2 -left-2 text-4xl text-primary/20 font-serif">
              "
            </div>
          </div>

          {/* Sender Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {message.child_alias.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {message.child_alias}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>
                     {message.region}
                    </span>
                  </div>
                </div>
              </div>
              <Heart className="h-5 w-5 text-red-400 fill-current group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/50">
            <div className="flex gap-2">
              <Badge variant="secondary" className="text-xs bg-white/60">
                {message.language === "en"
                  ? "🇬🇧 English"
                  : message.language === "zh"
                  ? "🇭🇰 中文"
                  : "🌐 Mixed"}
              </Badge>
              {message.donors && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  Personal
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{getTimeAgo(message.created_at)}</span>
            </div>
          </div>

          {/* Hover hint */}
          <motion.div
            className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
          >
            <p className="text-xs text-primary font-medium">
              Click to read the full message 💕
            </p>
          </motion.div>
        </CardContent>

        {/* Special border effect for personalized messages */}
        <div className="absolute inset-0 border-2 border-primary/20 rounded-lg group-hover:border-primary/40 transition-colors duration-300 pointer-events-none" />

        {/* Sparkle effect */}
        <div className="absolute top-2 right-2 text-yellow-400 group-hover:animate-pulse">
          ✨
        </div>
      </Card>
    </motion.div>
  );
}
