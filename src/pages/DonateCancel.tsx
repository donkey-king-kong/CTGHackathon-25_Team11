import { motion } from "framer-motion";
import { XCircle, Heart, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DonateCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Animation */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <XCircle className="h-24 w-24 text-red-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-4">
              Donation Cancelled
            </h1>
            <p className="text-xl text-gray-700">
              Your donation was cancelled and no payment was processed
            </p>
          </motion.div>

          {/* Information Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <div className="text-6xl mb-6">💝</div>
                <h2 className="text-2xl font-bold text-reach-green mb-4">
                  We understand
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  No worries! Your donation attempt was cancelled and no charges were made to your card. 
                  If you'd like to try again or explore other ways to support our mission, we're here to help.
                </p>
                
                <div className="bg-gradient-to-r from-reach-green/10 to-reach-orange/10 p-6 rounded-lg">
                  <h3 className="font-semibold text-reach-green mb-3 flex items-center">
                    <Heart className="mr-2 h-5 w-5" />
                    Every contribution matters
                  </h3>
                  <p className="text-gray-700">
                    Even small donations make a huge difference in the lives of underserved kindergarteners. 
                    Whether it's $10 HKD or $2 SGD, every amount helps provide educational resources.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button
              onClick={() => window.location.href = '/donate'}
              className="flex-1 bg-reach-orange hover:bg-reach-orange/90 text-white py-3"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={() => window.location.href = '/messages'}
              variant="outline"
              className="flex-1 border-reach-green text-reach-green hover:bg-reach-green hover:text-white py-3"
            >
              <Heart className="mr-2 h-4 w-4" />
              Read Thank You Letters
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="flex-1 py-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </motion.div>

          {/* Alternative Support Options */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12"
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-reach-green mb-4">
                  Other Ways to Support Project REACH
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-reach-green">Share Our Mission</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Help spread awareness about our work on social media
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-reach-green">Volunteer</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Get involved directly with our education programs
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-reach-green">Corporate Partnerships</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Explore partnership opportunities for your organization
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-reach-green">Alternative Payment</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Bank transfer or FPS options available
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}