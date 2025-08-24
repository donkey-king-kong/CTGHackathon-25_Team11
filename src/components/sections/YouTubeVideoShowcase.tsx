import React, { useState } from 'react';
import { Play, Clock } from 'lucide-react';

// Helper function to extract YouTube video ID from various YouTube URL formats
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// YouTube Video Player Component
const YouTubeVideoPlayer = ({ videoUrl, title, description, duration }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = getYouTubeVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px' }}>
        Invalid YouTube URL
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative bg-gray-900" style={{ aspectRatio: '16/9' }}>
        {!isLoaded ? (
          <div 
            className="relative w-full h-full group cursor-pointer" 
            onClick={() => setIsLoaded(true)}
          >
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-4 group-hover:bg-red-500 transition-colors duration-300 shadow-lg">
                <Play className="w-8 h-8 text-white" style={{ marginLeft: '4px' }} fill="currentColor" />
              </div>
            </div>

            {/* Duration Badge */}
            {duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {duration}
              </div>
            )}
          </div>
        ) : (
          <iframe
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
};

const educationalVideos = [
  {
    id: "storytelling-method",
    title: "What Our Teachers Think",
    description: "Teachers particularly appreciate how the encouraging environment has transformed their students into self-motivated learners.",
    videoUrl: "https://www.youtube.com/watch?v=6PkXFwTe064&ab_channel=StorySeeds",
    duration: "1:05",
    category: "Teachers"
  },
  {
    id: "chinese-fables",
    title: "Engaged in Learning",
    description: "Our student immersed in reading and discovering new words.",
    videoUrl: "https://www.youtube.com/watch?v=jEZfgs3gIJQ&ab_channel=StorySeeds",
    duration: "0:35",
    category: "Educational Content"
  },
  {
    id: "cultural-guide",
    title: "The Story Seeds Project",
    description: "Highlights from the Story Seeds Project.",
    videoUrl: "https://www.youtube.com/watch?v=VLeumD0K5to&ab_channel=StorySeeds",
    duration: "1:01",
    category: "Highlights"
  }
];

export default function YouTubeVideoShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Educational Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover innovative teaching methods and engaging content designed specifically 
            for English language education in Hong Kong.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {educationalVideos.map((video) => (
            <div key={video.id} className="flex flex-col">
              <YouTubeVideoPlayer
                videoUrl={video.videoUrl}
                title={video.title}
                description={video.description}
                duration={video.duration}
              />
              
              {/* Category Badge */}
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  {video.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-orange-500 text-white max-w-4xl mx-auto rounded-lg shadow-lg">
            <div className="p-8">
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
              
              <button className="bg-white text-green-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg transition-colors duration-300 inline-flex items-center">
                <span className="mr-2">💚</span>
                Support Education Innovation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}