import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Heart, Share2, Home, MessageCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { supabase } from "@/infrastructure/supabase/client";
import { toast } from "sonner";

interface DonationData {
  id: string;
  donor_name: string;
  amount: number;
  lives_impacted: number;
  created_at: string;
}

export default function DonateSuccess() {
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      fetchDonationDetails(sessionId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDonationDetails = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('id, donor_name, amount, lives_impacted, created_at')
        .eq('donor_id', sessionId)
        .single();

      if (error) throw error;
      
      setDonation(data);
    } catch (error) {
      console.error('Error fetching donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `I just donated to Project REACH to support English education for underserved kindergarteners in Hong Kong! ${donation?.lives_impacted && donation.lives_impacted > 0 ? `My donation will impact ${donation.lives_impacted} ${donation.lives_impacted === 1 ? 'child' : 'children'}.` : ''} #ProjectREACH #EducationForAll`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'I just donated to Project REACH!',
          text: shareText,
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${window.location.origin}`);
        toast.success('Share message copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reach-green mx-auto mb-4"></div>
          <p className="text-lg">Confirming your donation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <div className="relative inline-block">
              <CheckCircle className="h-24 w-24 text-reach-green mx-auto mb-4" />
              
              {/* Confetti Animation */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${50 + (Math.cos(i * 30 * Math.PI / 180) * 100)}px`,
                    top: `${50 + (Math.sin(i * 30 * Math.PI / 180) * 100)}px`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5 + i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  {['🎉', '💝', '⭐', '🌟'][i % 4]}
                </motion.div>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-reach-green mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-700">
              Your donation has been successfully processed
            </p>
          </motion.div>

          {/* Donation Details */}
          {donation && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl mb-8">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Badge className="bg-reach-green text-white text-lg px-4 py-2 mb-4">
                      Donation Confirmed
                    </Badge>
                    
                    <div className="text-3xl font-bold text-reach-green mb-2">
                      ${donation.amount.toFixed(2)} USD
                    </div>
                    
                    {donation.lives_impacted > 0 && (
                      <div className="bg-gradient-to-r from-reach-orange/10 to-reach-green/10 p-4 rounded-lg">
                        <div className="text-2xl mb-2">🌟</div>
                        <div className="text-lg font-semibold text-reach-orange">
                          Your donation will impact <span className="text-2xl">{donation.lives_impacted}</span> {donation.lives_impacted === 1 ? 'child' : 'children'}!
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Providing Reading Starter Kits with new books and stationary
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Donor Name:</span>
                      <span className="font-semibold">{donation.donor_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* What Happens Next */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-reach-green mb-4 flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  What Happens Next?
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-reach-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-semibold">Immediate Impact</div>
                      <div className="text-sm text-gray-600">Your donation is already being allocated to educational resources</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-reach-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-semibold">Email Confirmation</div>
                      <div className="text-sm text-gray-600">You'll receive a receipt and impact report within 24 hours</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-semibold">Thank You Letters</div>
                      <div className="text-sm text-gray-600">Look out for personal thank you letters from children in our program</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button
              onClick={handleShare}
              className="flex-1 bg-reach-green hover:bg-reach-green/90 text-white py-3"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Your Impact
            </Button>
            
            <Button
              onClick={() => window.location.href = '/messages'}
              variant="outline"
              className="flex-1 border-reach-orange text-reach-orange hover:bg-reach-orange hover:text-white py-3"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Read Thank You Letters
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1 py-3"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}