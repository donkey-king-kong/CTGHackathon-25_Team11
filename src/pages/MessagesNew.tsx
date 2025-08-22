import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileImage, FileVideo, Heart, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  child_alias: string;
  school: string;
  region: string;
  language: string;
  text: string;
  donor_tag: string;
  animation_type: string;
  consent: {
    guardian: boolean;
    school: boolean;
    media_release: boolean;
  };
}

export default function MessagesNew() {
  const [formData, setFormData] = useState<FormData>({
    child_alias: "",
    school: "",
    region: "",
    language: "",
    text: "",
    donor_tag: "",
    animation_type: "letterbox",
    consent: {
      guardian: false,
      school: false,
      media_release: false,
    },
  });
  
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const regions = [
    "Central & Western", "Eastern", "Southern", "Wan Chai",
    "Kowloon City", "Kwun Tong", "Sham Shui Po", "Wong Tai Sin", "Yau Tsim Mong",
    "Islands", "Kwai Tsing", "North", "Sai Kung", "Sha Tin", "Tai Po", "Tsuen Wan", "Tuen Mun", "Yuen Long"
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsentChange = (field: keyof FormData['consent'], checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      consent: { ...prev.consent, [field]: checked }
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/') && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isVideo = file.type.startsWith('video/') && file.type === 'video/mp4';
      const validSize = isImage ? file.size <= 5 * 1024 * 1024 : file.size <= 25 * 1024 * 1024; // 5MB for images, 25MB for videos
      
      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported format. Please use JPG, PNG, WebP, or MP4.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!validSize) {
        toast({
          title: "File too large",
          description: `${file.name} is too large. Images: max 5MB, Videos: max 25MB.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setMediaFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async (): Promise<{ urls: string[], types: string[] }> => {
    const urls: string[] = [];
    const types: string[] = [];
    
    for (const file of mediaFiles) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('message-media')
        .upload(fileName, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      urls.push(fileName);
      types.push(file.type.startsWith('image/') ? 'image' : 'video');
    }
    
    return { urls, types };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.child_alias || !formData.text || !formData.language) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.consent.guardian || !formData.consent.school || !formData.consent.media_release) {
      toast({
        title: "Consent required",
        description: "All consent checkboxes must be checked to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      let mediaData = { urls: [] as string[], types: [] as string[] };
      
      if (mediaFiles.length > 0) {
        mediaData = await uploadMedia();
      }
      
      const { error } = await supabase
        .from('messages')
        .insert([{
          child_alias: formData.child_alias,
          school: formData.school || null,
          region: formData.region || null,
          language: formData.language,
          text: formData.text,
          media_urls: mediaData.urls,
          media_types: mediaData.types,
          donor_tag: formData.donor_tag || null,
          animation_type: formData.animation_type,
          consent: formData.consent,
          status: 'pending'
        }]);
        
      if (error) throw error;
      
      setSubmitted(true);
      toast({
        title: "Message submitted successfully!",
        description: "Your message will be reviewed and published soon.",
      });
      
    } catch (error) {
      console.error('Error submitting message:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="max-w-lg mx-6">
          <CardContent className="text-center p-12">
            <div className="mb-6">
              <CheckCircle className="h-20 w-20 mx-auto text-brand-primary mb-4" />
              <div className="text-6xl mb-4">🎉</div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-brand-primary">Thank You!</h2>
            <p className="text-text-muted mb-6">
              Your heartfelt message has been received and will be reviewed before being shared with our donors. 
              Thank you for helping us show the impact of their generous support!
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = '/messages'}
                className="w-full"
              >
                View All Messages
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Submit Another Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-brand-primary to-brand-primary-dark">
        <div className="container mx-auto px-6">
          <div className="text-center text-white max-w-3xl mx-auto">
            <Heart className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Share Your Gratitude</h1>
            <p className="text-lg">
              Help us show donors the incredible impact of their support by sharing a thank you message.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-brand-primary" />
                Message Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Child Alias */}
              <div>
                <Label htmlFor="child_alias">Child's Name or Nickname *</Label>
                <Input
                  id="child_alias"
                  value={formData.child_alias}
                  onChange={(e) => handleInputChange('child_alias', e.target.value)}
                  placeholder="e.g., Little Emma, Kai, Rainbow..."
                  required
                />
                <p className="text-sm text-text-muted mt-1">
                  Use a nickname for privacy - no full names required
                </p>
              </div>

              {/* School */}
              <div>
                <Label htmlFor="school">School Name</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => handleInputChange('school', e.target.value)}
                  placeholder="e.g., Happy Valley Kindergarten"
                />
              </div>

              {/* Region */}
              <div>
                <Label htmlFor="region">Hong Kong Region</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language */}
              <div>
                <Label htmlFor="language">Message Language *</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="zh">中文 (Chinese)</SelectItem>
                    <SelectItem value="mixed">Mixed (English & Chinese)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message Text */}
              <div>
                <Label htmlFor="text">Thank You Message *</Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                  placeholder="Share your heartfelt thank you message to the donors..."
                  className="min-h-32"
                  required
                />
                <p className="text-sm text-text-muted mt-1">
                  Express how the donor's support has helped you or your child
                </p>
              </div>

              {/* Donor Tag */}
              <div>
                <Label htmlFor="donor_tag">For a Specific Donor (Optional)</Label>
                <Input
                  id="donor_tag"
                  value={formData.donor_tag}
                  onChange={(e) => handleInputChange('donor_tag', e.target.value)}
                  placeholder="e.g., Mr. Wong, ABC Company..."
                />
                <p className="text-sm text-text-muted mt-1">
                  If this message is for a specific donor or sponsor
                </p>
              </div>

              {/* Animation Type Selection */}
              <div>
                <Label htmlFor="animation_type">How should your letter be delivered? ✨</Label>
                <Select value={formData.animation_type} onValueChange={(value) => handleInputChange('animation_type', value)}>
                  <SelectTrigger className="bg-gradient-to-r from-pink-50 to-blue-50">
                    <SelectValue placeholder="Choose delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="letterbox">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📮</span>
                        <span>Classic Letter - Arrives in a mailbox</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="plane">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✈️</span>
                        <span>Paper Plane - Flies across the screen</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="heart">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">❤️</span>
                        <span>Love Letter - Appears with heart animation</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="balloon">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🎈</span>
                        <span>Balloon Delivery - Floats up to reveal message</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="candy">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🍭</span>
                        <span>Sweet Surprise - Unwraps like candy</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-text-muted mt-1">
                  Choose how you want your message to appear to donors - make it special! 🌟
                </p>
              </div>

              {/* Media Upload */}
              <div>
                <Label>Photos or Videos (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,video/mp4"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="media-upload"
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-text-muted" />
                      <p className="text-sm text-text-muted">
                        Click to upload photos (JPG, PNG, WebP, max 5MB) or videos (MP4, max 25MB)
                      </p>
                      <p className="text-xs text-text-muted mt-1">Maximum 5 files</p>
                    </div>
                  </label>
                </div>

                {/* File Preview */}
                {mediaFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-surface border rounded-lg">
                        <div className="flex items-center">
                          {file.type.startsWith('image/') ? (
                            <FileImage className="h-4 w-4 mr-2 text-brand-primary" />
                          ) : (
                            <FileVideo className="h-4 w-4 mr-2 text-brand-primary" />
                          )}
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consent Checkboxes */}
              <div className="space-y-4 p-4 bg-surface-soft rounded-lg">
                <h4 className="font-semibold">Required Consent</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="guardian-consent"
                    checked={formData.consent.guardian}
                    onCheckedChange={(checked) => handleConsentChange('guardian', checked as boolean)}
                  />
                  <Label htmlFor="guardian-consent" className="text-sm">
                    I have guardian/parental consent to share this message and any media on behalf of the child
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="school-consent"
                    checked={formData.consent.school}
                    onCheckedChange={(checked) => handleConsentChange('school', checked as boolean)}
                  />
                  <Label htmlFor="school-consent" className="text-sm">
                    I have school approval to share this message publicly
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="media-consent"
                    checked={formData.consent.media_release}
                    onCheckedChange={(checked) => handleConsentChange('media_release', checked as boolean)}
                  />
                  <Label htmlFor="media-consent" className="text-sm">
                    I consent to the public display of any uploaded photos/videos for Project REACH's mission
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting Message...
                  </>
                ) : (
                  <>
                    Submit Message
                    <Heart className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}