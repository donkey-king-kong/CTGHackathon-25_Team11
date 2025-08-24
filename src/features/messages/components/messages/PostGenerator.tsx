import { useState, useRef } from "react";
import { Instagram, Facebook, Download, Share2, Copy, Sparkles, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { toast } from "sonner";
import { OpenAIService, type CaptionOptimization } from "@/infrastructure/services/openai";
import { dataUrlToBlob, uploadHtmlToSupabase, uploadImageToSupabase, buildShareHtml, loadFacebookSdk, openShareDialog,makeId } from "@/shared/utils/socialShare";

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

interface PostGeneratorProps {
  message: Message;
}

export function PostGenerator({ message }: PostGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedCaption, setOptimizedCaption] = useState<CaptionOptimization | null>(null);

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
  
  const optimizeCaptionWithAI = async () => {
    setIsOptimizing(true);
    try {
      const optimization = await OpenAIService.optimizeCaption(
        message.child_alias,
        message.text,
        message.school,
        message.region
      );
      setOptimizedCaption(optimization);
      toast.success('Caption optimized with AI! 🤖✨');
    } catch (error) {
      console.error('Error optimizing caption:', error);
      toast.error('Failed to optimize caption with AI');
    } finally {
      setIsOptimizing(false);
    }
  };

  const postToInstagramStory = async (imageDataUrl: string) => {
    // Prepare the caption text
    const caption = optimizedCaption?.caption || 
      `❤️ Thank you message from ${message.child_alias}!\n\n"${message.text}"\n\n${message.school ? `🏫 ${message.school}\n` : ''}${message.region ? `📍 ${message.region}\n` : ''}#ProjectREACH #ThankYou #MakeADifference`;
    
    try {
      // Step 1: Download the image
      downloadImage(imageDataUrl, `thank-you-${message.child_alias.replace(/\s+/g, '-')}.png`);
      toast.success('Image downloaded! 📥');
      
      // Step 2: Copy caption to clipboard
      await navigator.clipboard.writeText(caption);
      toast.success('Caption copied to clipboard! 📋');
      
      // Step 3: Try Web Share API (realistic expectations)
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // For mobile: Try Web Share API - but be honest about limitations
      if (isMobile && navigator.share) {
        try {
          // Convert to blob for sharing
          const response = await fetch(imageDataUrl);
          const blob = await response.blob();
          const file = new File([blob], 'instagram-story.png', { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            // Show realistic expectations first
            const useWebShare = confirm(
              "📱 Try Native Sharing?\n\n" +
              "This will open your device's share menu where you can select Instagram.\n\n" +
              "Note: You'll still need to manually upload the image in Instagram.\n\n" +
              "Click OK to try, or Cancel for direct Instagram link."
            );
            
            if (useWebShare) {
              await navigator.share({
                title: 'Share to Instagram Story',
                text: caption,
                files: [file]
              });
              toast.success('Share dialog opened! Select Instagram 📱');
              
              // Realistic guidance
              setTimeout(() => {
                alert('📱 After selecting Instagram:\n\n1. Instagram will open\n2. You may need to manually select the image\n3. Create your Story or Post\n4. Paste the caption that was copied\n5. Share!');
              }, 1000);
              
              return;
            }
          }
        } catch (shareError) {
          console.log('Web Share API failed, trying direct Instagram link');
        }
      }
      
      // Step 4: Open Instagram to the correct creation page
      let instagramUrl = '';
      let instructions = '';
      
      if (isMobile) {
        // Mobile: Try Instagram app deep links
        try {
          // Show user what's about to happen
          const openApp = confirm(
            "📱 Open Instagram App?\n\n" +
            "This will try to open the Instagram app directly.\n\n" +
            "Your image is downloaded and caption is copied.\n\n" +
            "Click OK to try Instagram app, or Cancel for web version."
          );
          
          if (openApp) {
            // Try multiple Instagram deep link schemes
            window.location.href = 'instagram://camera';
            
            instructions = `📱 Instagram app should be opening!\n\n✅ Image downloaded to your device\n✅ Caption copied to clipboard\n\nIn Instagram:\n1. Tap "+" to create new post or your profile picture for Story\n2. Select "Camera Roll" or "Gallery"\n3. Find and select your downloaded image\n4. Paste caption and share! 🎉`;
            
            // Fallback to web if app doesn't open
            setTimeout(() => {
              window.open('https://www.instagram.com/', '_blank');
            }, 3000);
          } else {
            // User chose web version
            window.open('https://www.instagram.com/', '_blank');
            instructions = `📱 Instagram web opened!\n\n✅ Image downloaded\n✅ Caption copied\n\nIn Instagram:\n1. Tap your profile picture (top left) to add Story\n2. Or tap "+" to create new post\n3. Upload your downloaded image\n4. Paste caption and share! 🎉`;
          }
          
        } catch (error) {
          // Mobile web fallback
          window.open('https://www.instagram.com/', '_blank');
          instructions = `📱 Instagram web opened!\n\n✅ Image downloaded\n✅ Caption copied\n\nIn Instagram:\n1. Tap your profile picture (top left) to add Story\n2. Or tap "+" to create new post\n3. Upload your downloaded image\n4. Paste caption and share! 🎉`;
        }
      } else {
        // Desktop: Instagram web creation
        // Note: Instagram doesn't allow direct deep linking to creation pages for security
        // But we can open to the main page and guide users
        
        instagramUrl = 'https://www.instagram.com/';
        instructions = `🚀 Opening Instagram!\n\n✅ Image downloaded\n✅ Caption copied\n\nIn Instagram:\n1. Log in to your account\n2. Click your profile picture (top left) to add Story\n3. Or click "+" to create new post\n4. Upload your downloaded image\n5. Paste caption (Ctrl+V) and share! 🎉`;
        window.open(instagramUrl, '_blank');
      }
      
      // Show instructions
      if (instructions) {
        setTimeout(() => {
          alert(instructions);
        }, 500);
      }
      
      toast.success('Instagram opened! Follow the instructions 🎉');
      
    } catch (error) {
      console.error('Error opening Instagram:', error);
      toast.error('Failed to open Instagram. Please try manually.');
      
      // Manual fallback
      downloadImage(imageDataUrl, `thank-you-${message.child_alias.replace(/\s+/g, '-')}.png`);
      navigator.clipboard.writeText(caption).catch(() => {});
      window.open('https://www.instagram.com/', '_blank');
      
      alert(`📱 Manual mode:\n\n✅ Image downloaded\n✅ Caption copied\n\n1. Go to Instagram\n2. Create new Story\n3. Upload image\n4. Paste caption\n5. Share!`);
    }
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

  const shareToFacebook = async () => {
    try {
      console.groupCollapsed('%c[FB] Share flow','font-weight:bold;');
      console.time('[FB] total');

      // 1) ensure canvas has data
      const canvas = canvasRef.current; 
      console.log('[FB] step=1 canvasRef', { hasCanvas: !!canvas });
      if (!canvas) {
        console.error('[FB] step=1 error: Canvas not ready');
        throw new Error('Canvas not ready');
      }
      console.log('[FB] step=1 canvas size', { width: canvas.width, height: canvas.height });

      // 2) Export JPEG for FB 
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      console.log('[FB] step=2 dataUrl length', dataUrl.length);

      // 3) Make a lightweight title/description 
      const title = `A Thank-You Message${message?.child_alias ? ` from ${message.child_alias}` : ''}`;
      const raw = (message?.text || '').trim().replace(/\s+/g, ' ');
      const description = raw.length > 160 ? raw.slice(0, 157) + '…' : raw || 'Read and share.';
      console.log('[FB] step=3 meta', { title, descriptionPreview: description.slice(0, 80) });

      // 4) Upload image to Supabase
      const id = makeId();
      console.log('[FB] step=4 id', id);
      const imageBlob = await dataUrlToBlob(dataUrl);
      console.log('[FB] step=4 blob', { size: imageBlob.size, type: imageBlob.type });
      const imagePath = `posts/${id}.jpg`; // in bucket "shares"
      console.log('[FB] step=4 imagePath', imagePath);
      const imageUrl = await uploadImageToSupabase('shares', imagePath, imageBlob);
      console.log('[FB] step=4 imageUrl', imageUrl);

      // 5) Build & upload the OG share page (static HTML)
      // const pagePath = `shares/${id}.html`;
      // console.log('[FB] step=5 pagePath', pagePath);
      // const pageUrl = await uploadHtmlToSupabase(
      //   'shares',
      //   pagePath,
      //   buildShareHtml({
      //     title,
      //     description,
      //     imageUrl,
      //     // canonical URL can simply be the same Supabase public URL
      //     pageUrl: imageUrl.replace(/\/posts\/[^/]+\.jpg$/, `/${pagePath}`),
      //   })
      // );
      // console.log('[FB] step=5 pageUrl', pageUrl);

      // 6) Open Share Dialog
      console.log('[FB] step=5 opening dialog', {
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        href: imageUrl,
      });
      await loadFacebookSdk(import.meta.env.VITE_FACEBOOK_APP_ID!);
      openShareDialog(imageUrl);

      console.timeEnd('[FB] total');
      console.groupEnd();
    } catch (e) {
      const err = e as any;
      console.error('[FB] share failed', {
        name: err?.name,
        message: err?.message || String(err),
        stack: err?.stack,
      });
      console.groupEnd();
}

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Instagram className="h-4 w-4 mr-2" />
          Create A Post
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create A Post</DialogTitle>
          <DialogDescription>
            Generate a beautiful post from this thank you message for Instagram or Facebook!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Generation Controls */}
          <div className="text-center space-y-4">
            <Button 
              onClick={generateStaticPost}
              disabled={isGenerating}
              size="lg"
              className="bg-gradient-to-r from-reach-green to-reach-orange hover:from-reach-green/90 hover:to-reach-orange/90 text-white"
            >
              {isGenerating ? 'Creating Post...' : '✨ Generate Your Post'}
            </Button>
            
            {/* AI Caption Optimization */}
            <div className="flex justify-center">
              <Button
                onClick={optimizeCaptionWithAI}
                disabled={isOptimizing}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isOptimizing ? 'Optimizing with AI...' : 'Optimize Caption with AI'}
              </Button>
            </div>
          </div>
          
          {/* Canvas for rendering */}
          <canvas
            ref={canvasRef}
            className="hidden"
            width={1080}
            height={1080}
          />

          {/* AI-Optimized Caption Display */}
          {optimizedCaption && (
            <Card className="border-blue-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
                  AI-Optimized Content
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Caption:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      {optimizedCaption.caption}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Hashtags:</h4>
                    <div className="flex flex-wrap gap-1">
                      {optimizedCaption.hashtags.map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">📅 {optimizedCaption.suggestedTiming}</h4>
                  </div>
                  
                  {optimizedCaption.engagementTips.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-700 mb-2">💡 Engagement Tips:</h4>
                      <ul className="text-xs space-y-1">
                        {optimizedCaption.engagementTips.map((tip, index) => (
                          <li key={index} className="text-gray-600">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview and Controls */}
          {generatedPost && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Share Your Post!</h3>
                  
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
              <div className="text-center">
                  {/* Facebook share button */}
                  <Button
                    onClick={shareToFacebook}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-purple-700 text-white px-8"
                    disabled={isGenerating}
                  >
                    <Facebook className="h-5 w-5 mr-2" />
                    Post to Facebook
                  </Button>
                </div>

              <div className="space-y-4">
                {/* Instagram Share Button */}
                <div className="text-center">
                  <Button
                    onClick={() => postToInstagramStory(generatedPost)}
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Post to Instagram Story
                  </Button>
                </div>

                {/* Secondary Actions */}
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
                      // Use optimized caption if available, otherwise fallback
                      const caption = optimizedCaption?.caption || 
                        `❤️ Thank you message from ${message.child_alias}!\n\n"${message.text}"\n\n${message.school ? `🏫 ${message.school}\n` : ''}${message.region ? `📍 ${message.region}\n` : ''}Helping bridge Hong Kong's education gap, one child at a time. 🌟\n\n#ProjectREACH #ThankYou #HongKong #Education #Gratitude #MakeADifference`;
                      navigator.clipboard.writeText(caption);
                      toast.success('Caption copied to clipboard!');
                    }}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy {optimizedCaption ? 'AI Caption' : 'Caption'}
                  </Button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500 space-y-1">
                {optimizedCaption ? (
                  <>
                    <div>🤖 AI-optimized caption with strategic hashtags and timing suggestions!</div>
                    <div>📱 Click "Post to Instagram Story" to open Instagram with your content ready!</div>
                  </>
                ) : (
                  <>
                    <div>💡 Use "Optimize Caption with AI" for better engagement!</div>
                    <div>📱 Click "Post to Instagram Story" or "Post to Facebook" to share your post with everyone!</div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}