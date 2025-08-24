import { motion } from "framer-motion";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { VideoPlayer } from "@/shared/components/ui/video-player";

const educationalVideos = [
  {
    id: "storytelling-method",
    title: "TPRS Step-by-Step: ESL Storytelling Method for Hong Kong",
    description: "Transform English lessons with storytelling - a powerful method perfect for ESL classrooms in Hong Kong that makes learning engaging and effective.",
    thumbnail: "/api/placeholder/400/225",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video
    duration: "12:34",
    category: "Teaching Methods"
  },
  {
    id: "chinese-fables",
    title: "An Inspiring Journey through Chinese Fables and Tales",
    description: "Support English Language education at the primary level through engaging animation that helps students learn English in an enjoyable way.",
    thumbnail: "/api/placeholder/400/225", 
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Sample video
    duration: "8:45",
    category: "Educational Content"
  },
  {
    id: "cultural-guide",
    title: "Cultural Guide for Hong Kong ESL Teachers",
    description: "Get insights from 7 years of ESL teaching experience in Hong Kong - essential cultural knowledge for educators working with local students.",
    thumbnail: "/api/placeholder/400/225",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Sample video  
    duration: "15:22",
    category: "Teacher Training"
  }
];

export function VideoShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Educational Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover innovative teaching methods and engaging content designed specifically 
            for English language education in Hong Kong.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {educationalVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <VideoPlayer
                src={video.src}
                thumbnail={video.thumbnail}
                title={video.title}
                description={video.description}
                duration={video.duration}
                className="h-full"
              />
              
              {/* Category Badge */}
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                  {video.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-orange-500 text-white max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <span className="text-4xl mb-4 block">💖</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Help Us Create More Educational Content
                </h3>
                <p className="text-lg mb-6 opacity-90">
                  Your donation directly funds the development of innovative teaching 
                  materials and methods that reach children across Hong Kong.
                </p>
              </div>
              
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <span className="mr-2">💚</span>
                Support Education Innovation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}