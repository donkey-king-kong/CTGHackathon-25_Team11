import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Clock, Heart, ArrowUpRight, CheckCircle, User, Calendar, Sparkles } from "lucide-react";
import { supabase } from "@/infrastructure/supabase/client";

interface RecentDonation {
  id: string;
  donor_name: string;
  amount: number;
  lives_impacted: number;
  created_at: string;
}

export function RecentDonations() {
  const [donations, setDonations] = useState<RecentDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('id, donor_name, amount, lives_impacted, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        setDonations(data || []);
      } catch (error) {
        console.error('Error fetching recent donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDonations();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getAmountDisplay = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getAmountColor = (amount: number) => {
    if (amount >= 500000) return "text-purple-600";
    if (amount >= 300000) return "text-blue-600";
    if (amount >= 100000) return "text-green-600";
    if (amount >= 50000) return "text-orange-600";
    if (amount >= 25000) return "text-pink-600";
    return "text-brand-secondary";
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-brand-primary/10 via-green-100 to-brand-secondary/10 border-b border-brand-primary/20 px-6 py-5 relative overflow-hidden">
          {/* Background gratitude pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-2 left-4 text-4xl">❤️</div>
            <div className="absolute top-8 right-8 text-3xl">🙏</div>
            <div className="absolute bottom-4 left-1/2 text-2xl">✨</div>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div>
                <div className="h-6 bg-gray-200 rounded w-36 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-56"></div>
              </div>
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="text-right">
                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-brand-primary/10 via-green-100 to-brand-secondary/10 border-b border-brand-primary/20 px-6 py-5 relative overflow-hidden">
        {/* Background gratitude pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 left-4 text-4xl">❤️</div>
          <div className="absolute top-8 right-8 text-3xl">🙏</div>
          <div className="absolute bottom-4 left-1/2 text-2xl">✨</div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-xl shadow-lg">
              <Clock className="h-6 w-6 text-brand-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                Recent Donations
                <Sparkles className="h-5 w-5 text-brand-secondary animate-pulse" />
              </CardTitle>
              <CardDescription className="text-base text-gray-700 mt-2 font-medium">
                Latest contributions from our generous donor community
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200 shadow-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="font-bold">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {donations.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Clock className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl font-semibold mb-2">No donations recorded yet</p>
            <p className="text-gray-500 text-base">Be the first to make a difference!</p>
            <div className="mt-6 flex justify-center">
              <Heart className="h-8 w-8 text-brand-secondary animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map((donation, index) => (
              <div 
                key={donation.id}
                className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Background accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Main content - compact layout with no empty space */}
                <div className="relative z-10 flex items-center gap-4">
                  {/* Left side - Donor info */}
                  <div className="flex items-center gap-3">
                    {/* Enhanced donor avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-primary/30 via-brand-secondary/30 to-brand-primary/30 rounded-full flex items-center justify-center border-2 border-brand-primary/40 shadow-md relative">
                      <User className="h-5 w-5 text-brand-primary" />
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-brand-primary/20 blur-sm"></div>
                    </div>
                    
                    {/* Donor details */}
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-brand-primary transition-colors duration-300">
                        {donation.donor_name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-brand-primary" />
                          <span className="font-medium">{formatTimeAgo(donation.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="font-medium text-red-700">
                            {donation.lives_impacted} lives
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Amount and action (no empty space) */}
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-black text-lg ${getAmountColor(donation.amount)} group-hover:scale-105 transition-transform duration-300`}>
                        {getAmountDisplay(donation.amount)}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        Donation
                      </p>
                    </div>
                    
                    {/* Action indicator */}
                    <div className="p-2 rounded-full bg-gray-50 group-hover:bg-brand-primary/10 transition-colors duration-300">
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-brand-primary transition-colors duration-300" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
        
        {/* Enhanced gratitude footer */}
        {donations.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-gradient-to-r from-red-100 to-pink-100 rounded-full shadow-sm">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <span className="font-bold text-base">{donations.length} recent donations</span>
              </div>
              <div className="flex items-center gap-3 text-green-700 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200 shadow-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-bold">Thank you for your generosity! 🙏</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}