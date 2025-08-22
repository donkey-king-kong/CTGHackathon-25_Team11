import { useState, useRef } from "react";
import { Instagram, Download, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Message {
  id: string;
  child_alias: string;
  school: string;
  region: string;
  language: string;
  text: string;
  media_urls: string[];
  created_at: string;
  animation_type: string;
}

interface InstagramPostGeneratorProps {
  message: Message;
}

export function InstagramPostGenerator({ message }: InstagramPostGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const generateStaticPost = async () => {
    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set Instagram post dimensions (1080x1080)
      canvas.width = 1080;
      canvas.height = 1080;
      
      // Clear canvas
      ctx.clearRect(0, 0, 1080, 1080);
      
      // Draw static post
      await drawStaticPost(ctx);
      
      // Convert to base64 and store
      const postUrl = canvas.toDataURL('image/png', 0.9);
      setGeneratedPost(postUrl);
      
    } catch (error) {
      console.error('Error generating post:', error);
      toast.error('Failed to generate Instagram post');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const drawStaticPost = async (ctx: CanvasRenderingContext2D) => {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#006E34'); // reach-green
    gradient.addColorStop(0.5, '#FF6B35'); // reach-orange
    gradient.addColorStop(1, '#006E34'); // reach-green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * 1080;
      const y = Math.random() * 1080;
      const radius = Math.random() * 40 + 20;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Main content container
    const contentY = 150;
    const contentHeight = 780;
    
    // Semi-transparent white background for text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(60, contentY, 960, contentHeight);
    
    // Border
    ctx.strokeStyle = '#006E34';
    ctx.lineWidth = 8;
    ctx.strokeRect(60, contentY, 960, contentHeight);
    
    // Title
    ctx.fillStyle = '#006E34';
    ctx.font = 'bold 52px Arial, sans-serif';
    ctx.textAlign = 'center';
    const title = "Thank You Message ❤️";
    ctx.fillText(title, 540, contentY + 80);
    
    // Child info
    ctx.font = '40px Arial, sans-serif';
    ctx.fillStyle = '#FF6B35';
    const childInfo = `From: ${message.child_alias}`;
    ctx.fillText(childInfo, 540, contentY + 150);
    
    if (message.school) {
      const schoolInfo = `School: ${message.school}`;
      ctx.fillText(schoolInfo, 540, contentY + 200);
    }
    
    if (message.region) {
      const regionInfo = `📍 ${message.region}`;
      ctx.fillText(regionInfo, 540, contentY + (message.school ? 250 : 200));
    }
    
    // Message text - wrap text
    ctx.font = '36px Arial, sans-serif';
    ctx.fillStyle = '#2c3e50';
    const words = message.text.split(' ');
    let line = '';
    let y = contentY + (message.school && message.region ? 320 : message.school || message.region ? 270 : 250);
    const maxWidth = 860;
    const lineHeight = 50;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, 540, y);
        line = words[n] + ' ';
        y += lineHeight;
        
        if (y > contentY + contentHeight - 120) break; // Stop if running out of space
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, y);
    
    // Project REACH branding
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillStyle = '#006E34';
    ctx.fillText('PROJECT REACH', 540, contentY + contentHeight - 60);
    
    // Tagline
    ctx.font = '24px Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('Bridging Hong Kong\'s Education Gap', 540, contentY + contentHeight - 30);
    
    // Date in corner
    ctx.font = '20px Arial, sans-serif';
    ctx.fillStyle = '#999';
    ctx.textAlign = 'right';
    const date = new Date(message.created_at).toLocaleDateString();
    ctx.fillText(date, 1000, contentY + contentHeight - 10);
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const sharePost = async (dataUrl: string) => {
    try {
      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'instagram-post.png', { type: 'image/png' })] })) {
        await navigator.share({
          title: 'Thank You Message from Project REACH',
          text: `A heartfelt thank you message from ${message.child_alias}`,
          files: [new File([blob], 'instagram-post.png', { type: 'image/png' })]
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        toast.success('Image copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share image');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Instagram className="h-4 w-4 mr-2" />
          Create Instagram Post
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Instagram Post</DialogTitle>
          <DialogDescription>
            Generate a beautiful Instagram post from this thank you message
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Generation Controls */}
          <div className="text-center">
            <Button 
              onClick={generateStaticPost}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-reach-green to-reach-orange hover:from-reach-green/90 hover:to-reach-orange/90 text-white"
            >
              {isGenerating ? 'Creating Post...' : '✨ Generate Instagram Post'}
            </Button>
          </div>
          
          {/* Canvas for rendering */}
          <canvas
            ref={canvasRef}
            className="hidden"
            width={1080}
            height={1080}
          />
          
          {/* Preview and Controls */}
          {generatedPost && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Your Instagram Post</h3>
                  
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden max-w-md mx-auto shadow-lg">
                    <img 
                      src={generatedPost} 
                      alt="Instagram post preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => downloadImage(generatedPost, `thank-you-${message.child_alias.replace(/\s+/g, '-')}.png`)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Image
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => sharePost(generatedPost)}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Post
                </Button>
                
                <Button
                  onClick={() => {
                    // Copy Instagram caption to clipboard
                    const caption = `❤️ Thank you message from ${message.child_alias}!\n\n"${message.text}"\n\n${message.school ? `🏫 ${message.school}\n` : ''}${message.region ? `📍 ${message.region}\n` : ''}Helping bridge Hong Kong's education gap, one child at a time. 🌟\n\n#ProjectREACH #ThankYou #HongKong #Education #Gratitude #MakeADifference`;
                    navigator.clipboard.writeText(caption);
                    toast.success('Caption copied to clipboard!');
                  }}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Caption
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                💡 Tip: The caption has been optimized for Instagram with relevant hashtags!
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}