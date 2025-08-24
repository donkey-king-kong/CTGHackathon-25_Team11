import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, CreditCard, Smartphone, DollarSign, Users, BookOpen, Target, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ReachDonate() {
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("hkd");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("");

  const donationAmounts = {
    hkd: [
      { amount: 250, lives: 1, description: "Reading Starter Kit for 1 child" },
      { amount: 500, lives: 2, description: "Reading Starter Kits for 2 children" },
      { amount: 1000, lives: 4, description: "Reading Starter Kits for 4 children" },
      { amount: 2500, lives: 10, description: "Reading Starter Kits for 10 children" },
    ],
    sgd: [
      { amount: 50, lives: 1, description: "School supplies & English storybook for 1 child" },
      { amount: 100, lives: 2, description: "School supplies & English storybooks for 2 children" },
      { amount: 200, lives: 4, description: "School supplies & English storybooks for 4 children" },
      { amount: 500, lives: 10, description: "School supplies & English storybooks for 10 children" },
    ]
  };

 const regions = ["All Regions", "Central & Western", "Eastern", "Southern", "Wan Chai", "Kowloon City", 
  "Kwun Tong", "Sham Shui Po", "Wong Tai Sin", "Yau Tsim Mong", "Islands", "Kwai Tsing", 
  "North", "Sai Kung", "Sha Tin", "Tai Po", "Tsuen Wan", "Tuen Mun", "Yuen Long"];


  const calculateLivesImpacted = (donationAmount: number) => {
    if (currency === 'sgd') {
      return Math.floor(donationAmount / 50);
    } else {
      return Math.floor(donationAmount / 250);
    }
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!donorName || !donorEmail || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      toast.error("Please enter a valid donation amount");
      return;
    }

    // Convert to cents
    const amountInCents = Math.round(donationAmount * 100);
    const minAmount = currency === 'sgd' ? 200 : 1000; // $2 SGD or $10 HKD minimum

    if (amountInCents < minAmount) {
      toast.error(`Minimum donation amount is ${currency === 'sgd' ? '$2 SGD' : '$10 HKD'}`);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: {
          donorName: isAnonymous ? "Anonymous Donor" : donorName,
          donorEmail,
          amount: amountInCents,
          currency: currency.toLowerCase(),
          message,
          isAnonymous,
          region
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }

    } catch (error: any) {
      console.error('Donation error:', error);
      toast.error(error.message || "Failed to process donation");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAmount = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-reach-green/5 to-reach-orange/5">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-reach-green to-reach-orange">
        <div className="container mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-6">💝</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Make a Difference Today
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
              Your donation directly supports underserved kindergarteners in Hong Kong, 
              giving them the tools they need to succeed in English and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Donation Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-reach-green mb-2">
                  Secure Online Donation
                </CardTitle>
                <p className="text-gray-600">
                  Powered by Stripe • 100% secure • Minimal administrative costs
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleDonation} className="space-y-6">
                  {/* Currency Selection */}
                  <div>
                    <Label htmlFor="currency" className="text-base font-semibold">
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hkd">🇭🇰 Hong Kong Dollar (HKD)</SelectItem>
                        <SelectItem value="sgd">🇸🇬 Singapore Dollar (SGD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Amount Selection */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Choose Your Impact
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {donationAmounts[currency as keyof typeof donationAmounts].map((preset) => (
                        <Button
                          key={preset.amount}
                          type="button"
                          variant={amount === preset.amount.toString() ? "default" : "outline"}
                          className={`p-4 h-auto text-left ${
                            amount === preset.amount.toString() 
                              ? "bg-reach-green text-white" 
                              : "hover:border-reach-green"
                          }`}
                          onClick={() => handleQuickAmount(preset.amount)}
                        >
                          <div>
                            <div className="font-bold text-lg">
                              ${preset.amount} {currency.toUpperCase()}
                            </div>
                            <div className="text-xs opacity-80">
                              {preset.lives} {preset.lives === 1 ? 'child' : 'children'}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <Label htmlFor="amount" className="text-base font-semibold">
                      Custom Amount ({currency.toUpperCase()})
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder={`Enter amount in ${currency.toUpperCase()}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 text-lg"
                        min={currency === 'sgd' ? '2' : '10'}
                        step="0.01"
                        required
                      />
                    </div>
                    {amount && !isNaN(parseFloat(amount)) && (
                      <p className="text-sm text-reach-green mt-2">
                        💝 This will impact <strong>{calculateLivesImpacted(parseFloat(amount))}</strong> {calculateLivesImpacted(parseFloat(amount)) === 1 ? 'child' : 'children'}
                      </p>
                    )}
                  </div>

                  {/* Donor Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="donorName" className="text-base font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="donorName"
                        type="text"
                        placeholder="Your full name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="donorEmail" className="text-base font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Region selection */}

                  <div>
                    <Label htmlFor="region" className="text-base font-semibold">
                      Would you like your contribution to support a specific region*?
                    </Label>
                    <p className="text-xs text-text-muted mb-3 flex items-center">
                     REACH will make every effort to allocate funds accordingly; however, this cannot be guaranteed.
                    </p>
                    
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger className="w-48 bg-white/90 border-brand-primary/20">
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Regions" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region} className="text-lg">{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  

                  {/* Optional Message */}
                  <div>
                    <Label htmlFor="message" className="text-base font-semibold">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Leave a message of support for the children..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Anonymity Option */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 text-reach-green bg-gray-100 border-gray-300 rounded focus:ring-reach-green focus:ring-2"
                      />
                      <Label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                        🕶️ Make my donation anonymous
                      </Label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 ml-7">
                      {isAnonymous 
                        ? "Your donation will show as 'Anonymous Donor' in thank you messages and public displays." 
                        : "Your name will be included in thank you messages from the children (unless you change this later)."}
                    </p>
                  </div>

                  {/* Donate Button */}
                  <Button
                    type="submit"
                    className="w-full bg-reach-orange hover:bg-reach-orange/90 text-white text-lg py-4"
                    disabled={loading}
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Donate Securely via Stripe
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    Your donation will be processed securely by Stripe. You'll be redirected to complete your payment.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Impact Information */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Impact Calculator */}
            <Card className="bg-gradient-to-br from-reach-green/10 to-reach-orange/10 border-reach-green/20">
              <CardHeader>
                <CardTitle className="text-reach-green flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-sm text-gray-600">With {currency.toUpperCase()} donations:</div>
                    <div className="text-2xl font-bold text-reach-green">
                      ${currency === 'sgd' ? '50' : '250'} = 1 child supported
                    </div>
                    <div className="text-sm text-gray-600">
                      {currency === 'sgd' 
                        ? 'Essential school supplies + English storybook'
                        : 'Complete Reading Starter Kit with new books & stationary'
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Donate */}
            <Card>
              <CardHeader>
                <CardTitle className="text-reach-green flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Why Your Donation Matters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-reach-orange mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">40,000 children in poverty</div>
                      <div className="text-sm text-gray-600">Kindergarten students in Hong Kong need our support</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-reach-orange mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">English proficiency gap</div>
                      <div className="text-sm text-gray-600">Critical foundation years that determine future success</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-reach-orange mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Direct impact</div>
                      <div className="text-sm text-gray-600">Your donation goes directly to educational resources</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Donation Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="text-reach-green">
                  Other Ways to Donate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      FPS (Hong Kong)
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Transfer directly to our FPS account for instant donations
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Contact us for direct bank transfer details
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="font-semibold text-green-700 mb-2">100% Secure</div>
                  <div className="text-sm text-gray-600">
                    Powered by Stripe • SSL Encrypted • No card details stored
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