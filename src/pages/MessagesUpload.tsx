import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Upload,
  X,
  FileImage,
  FileVideo,
  Sparkles,
  Star,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MultiDonorSelect } from "@/components/messages/DonorSearch";

interface FormData {
  child_alias: string;
  // region: string;
  language: string;
  text: string;
  donors: string[];
  animation_type: string;
  consent: {
    guardian: boolean;
    school: boolean;
    media_release: boolean;
  };
  privacy: string;
}

export default function MessagesUpload() {
  const [formData, setFormData] = useState<FormData>({
    child_alias: "",
    // region: "",
    language: "",
    text: "",
    donors: [],
    animation_type: "letterbox",
    consent: {
      guardian: false,
      school: false,
      media_release: false,
    },
    privacy: "general",
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // const regions = [
  //   "Central & Western", "Eastern", "Southern", "Wan Chai",
  //   "Kowloon City", "Kwun Tong", "Sham Shui Po", "Wong Tai Sin", "Yau Tsim Mong",
  //   "Islands", "Kwai Tsing", "North", "Sai Kung", "Sha Tin", "Tai Po", "Tsuen Wan", "Tuen Mun", "Yuen Long"
  // ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConsentChange = (
    field: keyof FormData["consent"],
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      consent: { ...prev.consent, [field]: checked },
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) => {
      const isImage =
        file.type.startsWith("image/") &&
        ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const isVideo =
        file.type.startsWith("video/") && file.type === "video/mp4";
      const validSize = isImage
        ? file.size <= 5 * 1024 * 1024
        : file.size <= 25 * 1024 * 1024;

      if (!isImage && !isVideo) {
        toast({
          title: "Oops! 📷",
          description: `${file.name} isn't a photo or video we can use. Try JPG, PNG, or MP4!`,
          variant: "destructive",
        });
        return false;
      }

      if (!validSize) {
        toast({
          title: "File too big! 📦",
          description: `${file.name} is too large. Keep photos under 5MB and videos under 25MB.`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    });

    setMediaFiles((prev) => [...prev, ...validFiles].slice(0, 3)); // Max 3 files for kids
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async (): Promise<{
    urls: string[];
    types: string[];
  }> => {
    const urls: string[] = [];
    const types: string[] = [];

    for (const file of mediaFiles) {
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("message-media")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      urls.push(fileName);
      types.push(file.type.startsWith("image/") ? "image" : "video");
    }

    return { urls, types };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.child_alias || !formData.text || !formData.language) {
      toast({
        title: "Almost there! 🌟",
        description: "Please fill in your name, message, and language.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.consent.guardian ||
      !formData.consent.school ||
      !formData.consent.media_release
    ) {
      toast({
        title: "Permission needed 👆",
        description:
          "Please check all the permission boxes with your grown-up!",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      let mediaData = { urls: [] as string[], types: [] as string[] };

      if (mediaFiles.length > 0) {
        // Upload media to supabase storage
        mediaData = await uploadMedia();
      }

      const { error } = await supabase.from("messages").insert([
        {
          child_alias: formData.child_alias,
          language: formData.language,
          // region: formData.region,
          text: formData.text,
          media_urls: mediaData.urls,
          media_types: mediaData.types,
          donors: formData.donors || null,
          animation_type: formData.animation_type,
          consent: formData.consent,
          type: formData.privacy,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Yay! Message sent! 🎉",
        description:
          "Your thank you message will be shared with the donors soon!",
      });
    } catch (error) {
      console.error("Error submitting message:", error);
      toast({
        title: "Oops! Something went wrong 😅",
        description: "Let's try again! Ask a grown-up if you need help.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-lg mx-auto bg-white/80 backdrop-blur-sm border-2 border-purple-200">
            <CardContent className="text-center p-12">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 text-purple-600">
                Amazing! 🌟
              </h2>
              <p className="text-lg mb-6 text-gray-700">
                Your beautiful thank you message has been sent! 💌 The kind
                people who helped you will be so happy to read it!
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => (window.location.href = "/messages")}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg py-3"
                >
                  See All Messages 📬
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 text-lg py-3"
                >
                  Send Another Message ✨
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Fun Header */}
      <section className="py-16 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="animate-pulse absolute top-10 left-10 text-4xl">
            ⭐
          </div>
          <div className="animate-pulse absolute top-20 right-20 text-3xl delay-1000">
            🌟
          </div>
          <div className="animate-pulse absolute bottom-10 left-20 text-5xl delay-500">
            ✨
          </div>
          <div className="animate-pulse absolute bottom-20 right-10 text-4xl delay-1500">
            💫
          </div>
        </div>

        <div className="container mx-auto px-6 relative">
          <motion.div
            className="text-center text-white max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-7xl mb-6">💌</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Send a Thank You Message!
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Share your happy feelings with the kind people who helped you! 🥰
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <motion.form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
            <CardHeader className="flex">
              <div className="flex items-start gap-2">
                <Heart className="h-5 w-5 text-brand-primary" />
                <span className="font-semibold text-lg">Message Details</span>
              </div>

              {/* Right side: toggle with labels */}
              <div className="flex items-end align gap-2">
                <span className="text-sm text-text-muted">Private</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      privacy:
                        prev.privacy === "general" ? "specific" : "general",
                    }))
                  }
                  className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${
                    formData.privacy === "general"
                      ? "bg-green-700"
                      : "bg-gray-500"
                  }`}
                  aria-pressed={formData.privacy === "general"}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${
                      formData.privacy === "general"
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>

                <span className="text-sm text-text-muted">Public</span>
                <p className="text-sm text-text-muted mt-1">
                  Private notes are only visible to addressed donors.
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* Name */}
              <div>
                <Label
                  htmlFor="child_alias"
                  className="text-lg font-bold text-purple-600 flex items-center"
                >
                  <Star className="h-5 w-5 mr-2" />
                  What's your name or nickname? ✨
                </Label>
                <Input
                  id="child_alias"
                  value={formData.child_alias}
                  onChange={(e) =>
                    handleInputChange("child_alias", e.target.value)
                  }
                  placeholder="e.g., Little Emma, Kai, Rainbow... 🌈"
                  className="mt-2 text-lg p-4 border-2 border-purple-200 rounded-xl focus:border-purple-400"
                  required
                />
                <p className="text-sm text-purple-500 mt-2 flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  You can use any fun name you like!
                </p>
              </div>

              {/* Region */}
              {/* <div>
                <Label htmlFor="region" className="text-lg font-bold text-green-600">
                  🗺️ Where do you live in Hong Kong?
                </Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger className="mt-2 text-lg p-4 border-2 border-green-200 rounded-xl focus:border-green-400">
                    <SelectValue placeholder="Pick your area 🏠" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region} className="text-lg">{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              {/* Language */}
              <div>
                <Label
                  htmlFor="language"
                  className="text-lg font-bold text-orange-600 flex items-center"
                >
                  🌍 What language will you use?{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    handleInputChange("language", value)
                  }
                  required
                >
                  <SelectTrigger className="mt-2 text-lg p-4 border-2 border-orange-200 rounded-xl focus:border-orange-400">
                    <SelectValue placeholder="Choose your language 🗣️" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en" className="text-lg">
                      🇬🇧 English
                    </SelectItem>
                    <SelectItem value="zh" className="text-lg">
                      🇨🇳 中文 (Chinese)
                    </SelectItem>
                    <SelectItem value="mixed" className="text-lg">
                      🌟 Both Languages!
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message */}
              <div>
                <Label
                  htmlFor="text"
                  className="text-lg font-bold text-pink-600 flex items-center"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Your Thank You Message{" "}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                  placeholder="Tell the kind people how their help made you happy! Write about what you learned, how you feel, or anything you want to say! 😊"
                  className="mt-2 text-lg p-4 border-2 border-pink-200 rounded-xl focus:border-pink-400 min-h-32"
                  required
                />
                <p className="text-sm text-pink-500 mt-2">
                  💝 Share your happy feelings and what their help means to you!
                </p>
              </div>

              <div>
                <Label htmlFor="donors">For a Specific Donor (Optional)</Label>
                <MultiDonorSelect
                  value={formData.donors}
                  onChange={(newDonors) =>
                    handleInputChange("donors", newDonors)
                  }
                />

                <p className="text-sm text-text-muted mt-1">
                  If this message is for a specific donor or sponsor
                </p>
              </div>

              {/* Animation Type */}
              <div>
                <Label
                  htmlFor="animation_type"
                  className="text-lg font-bold text-indigo-600"
                >
                  🎬 How should your message arrive?
                </Label>
                <Select
                  value={formData.animation_type}
                  onValueChange={(value) =>
                    handleInputChange("animation_type", value)
                  }
                >
                  <SelectTrigger className="mt-2 text-lg p-4 border-2 border-indigo-200 rounded-xl focus:border-indigo-400">
                    <SelectValue placeholder="Pick something fun! ✨" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balloon" className="text-lg">
                      🎈 Flying Balloon - Floats up with your message!
                    </SelectItem>
                    <SelectItem value="plane" className="text-lg">
                      ✈️ Paper Plane - Flies across the screen!
                    </SelectItem>
                    <SelectItem value="heart" className="text-lg">
                      💕 Love Hearts - Appears with dancing hearts!
                    </SelectItem>
                    <SelectItem value="letterbox" className="text-lg">
                      📮 Magic Mailbox - Pops out like magic!
                    </SelectItem>
                    {/* <SelectItem value="candy" className="text-lg">
                      🍭 Sweet Surprise - Unwraps like candy!
                    </SelectItem> */}
                  </SelectContent>
                </Select>
                <p className="text-sm text-indigo-500 mt-2">
                  🌟 Choose how you want your message to appear - make it
                  special!
                </p>
              </div>

              {/* Media Upload */}
              <div>
                <Label className="text-lg font-bold text-teal-600">
                  📸 Add Photos or Videos (if you want!)
                </Label>
                <div className="border-2 border-dashed border-teal-200 rounded-xl p-6 mt-2 bg-teal-50/50">
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
                      <Upload className="h-12 w-12 mx-auto mb-4 text-teal-400" />
                      <p className="text-lg text-teal-600 font-bold">
                        Tap here to add photos or videos! 📱
                      </p>
                      <p className="text-sm text-teal-500 mt-2">
                        You can add up to 3 files! 🎉
                      </p>
                    </div>
                  </label>
                </div>

                {/* File Preview */}
                {mediaFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {mediaFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border-2 border-teal-200 rounded-lg"
                      >
                        <div className="flex items-center">
                          {file.type.startsWith("image/") ? (
                            <FileImage className="h-5 w-5 mr-2 text-teal-500" />
                          ) : (
                            <FileVideo className="h-5 w-5 mr-2 text-teal-500" />
                          )}
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consent Section */}
              <div className="space-y-4 p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <h4 className="text-lg font-bold text-yellow-700 flex items-center">
                  👨‍👩‍👧‍👦 Ask a grown-up to help with this part!
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="guardian-consent"
                      checked={formData.consent.guardian}
                      onCheckedChange={(checked) =>
                        handleConsentChange("guardian", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="guardian-consent"
                      className="text-sm leading-relaxed"
                    >
                      👨‍👩‍👧‍👦 I have guardian/parental consent to share this message
                      and any media on behalf of the child
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="school-consent"
                      checked={formData.consent.school}
                      onCheckedChange={(checked) =>
                        handleConsentChange("school", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="school-consent"
                      className="text-sm leading-relaxed"
                    >
                      🏫 I have school approval to share this message publicly
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="media-consent"
                      checked={formData.consent.media_release}
                      onCheckedChange={(checked) =>
                        handleConsentChange("media_release", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label
                      htmlFor="media-consent"
                      className="text-sm leading-relaxed"
                    >
                      📺 I consent to the public display of any uploaded
                      photos/videos for Project REACH's mission
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white text-xl py-6 rounded-xl shadow-lg"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending your message... 📤
                    </div>
                  ) : (
                    <>
                      <Heart className="mr-2 h-6 w-6" />
                      Send My Thank You Message! 💌
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.form>
      </div>
    </div>
  );
}
