import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Calendar, TrendingUp, Trophy, Medal, Award, Star, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/infrastructure/supabase/client";

interface MonthlyDonor {
  donor_name: string;
  amount: number;
  lives_impacted: number;
  month: string;
}

export function MonthlyRankings() {
  const [monthlyDonors, setMonthlyDonors] = useState<MonthlyDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    const fetchMonthlyRankings = async () => {
      try {
        const now = new Date();
        const currentMonthStr = now.toISOString().slice(0, 7); // YYYY-MM format
        setCurrentMonth(now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));

        // Month boundaries
        const startDate = `${currentMonthStr}-01`;
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

        console.log('Current month string:', currentMonthStr);
        console.log('Date filter start:', startDate);
        console.log('Date filter end:', endDate);

        const { data, error } = await supabase
          .from('donations')
          .select('donor_name, amount, lives_impacted, created_at')
          .gte('created_at', startDate)
          .lt('created_at', endDate)
          .order('amount', { ascending: false });

        console.log('Monthly query response:', { data, error });
        console.log('Monthly data length:', data?.length);

        if (error) throw error;

        // Aggregate by donor for current month
        const donorMap = new Map<string, MonthlyDonor>();
        
        data?.forEach((donation) => {
          const existing = donorMap.get(donation.donor_name);
          if (existing) {
            existing.amount += Number(donation.amount);
            existing.lives_impacted += donation.lives_impacted;
          } else {
            donorMap.set(donation.donor_name, {
              donor_name: donation.donor_name,
              amount: Number(donation.amount),
              lives_impacted: donation.lives_impacted,
              month: currentMonthStr,
            });
          }
        });

        const sortedDonors = Array.from(donorMap.values())
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 10);

        setMonthlyDonors(sortedDonors);
      } catch (error) {
        console.error('Error fetching monthly rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyRankings();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-100" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-100" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-100" />;
    return null;
  };

  const getRankBackground = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-lg shadow-gray-400/30";
    if (rank === 3) return "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-lg shadow-amber-600/30";
    if (rank === 4) return "bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600 shadow-lg shadow-pink-500/30";
    if (rank === 5) return "bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 shadow-lg shadow-purple-500/30";
    if (rank === 6) return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/30";
    if (rank === 7) return "bg-gradient-to-br from-green-400 via-green-500 to-green-600 shadow-lg shadow-green-500/30";
    if (rank === 8) return "bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30";
    if (rank === 9) return "bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 shadow-lg shadow-teal-500/30";
    return "bg-gradient-to-br from-brand-secondary via-brand-secondary-light to-brand-secondary-dark shadow-lg shadow-brand-secondary/30";
  };

  const getRankTextColor = (rank: number) => {
    if (rank <= 3) return "text-white";
    if (rank <= 9) return "text-white";
    return "text-white";
  };

  const getRowBackground = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-yellow-200";
    if (rank === 2) return "bg-gradient-to-r from-gray-50 via-slate-50 to-zinc-50 border-gray-200";
    if (rank === 3) return "bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-amber-200";
    if (rank === 4) return "bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 border-pink-200";
    if (rank === 5) return "bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 border-purple-200";
    if (rank === 6) return "bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 border-blue-200";
    if (rank === 7) return "bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-green-200";
    if (rank === 8) return "bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 border-indigo-200";
    if (rank === 9) return "bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 border-teal-200";
    return "bg-gradient-to-r from-brand-secondary/5 via-brand-secondary/10 to-brand-secondary/5 border-brand-secondary/20";
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-50">
        <CardHeader className="bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-primary/10 border-b border-brand-primary/20 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary/20 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/20 rounded-full translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-brand-primary/20 rounded-full -translate-x-10 translate-y-10"></div>
          </div>
          
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-brand-primary relative z-10">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg">
              <Calendar className="h-7 w-7 text-brand-primary" />
            </div>
            Monthly Donor Rankings
            <Sparkles className="h-6 w-6 text-brand-secondary animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="animate-pulse space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 sm:h-20 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-primary/10 border-b border-brand-primary/20 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-brand-primary/20 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-secondary/20 rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-brand-primary/20 rounded-full -translate-x-10 translate-y-10"></div>
        </div>
        
        <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-brand-primary relative z-10">
          <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg">
            <Calendar className="h-5 w-5 sm:h-7 sm:w-7 text-brand-primary" />
          </div>
          <span className="text-lg sm:text-2xl">Monthly Donor Rankings</span>
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-brand-secondary animate-pulse" />
        </CardTitle>
        <CardDescription className="text-base sm:text-lg text-brand-primary/80 mt-2 sm:mt-3 relative z-10 font-medium">
          Top contributors for {currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {monthlyDonors.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
              <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg sm:text-xl font-semibold mb-2">No donations recorded for this month yet.</p>
            <p className="text-muted-foreground/70 text-sm sm:text-base">Be the first to make a difference!</p>
            <div className="mt-4 sm:mt-6 flex justify-center">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-brand-secondary animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {monthlyDonors.map((donor, index) => (
              <div 
                key={`${donor.donor_name}-${index}`}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:rotate-1 ${getRowBackground(index + 1)}`}
              >
                {/* Background accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Decorative elements */}
                <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                  <Star className="h-4 w-4 text-brand-secondary" />
                </div>
                
                <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
                    {/* Enhanced rank indicator */}
                    <div className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl shadow-xl flex-shrink-0 ${getRankBackground(index + 1)} ${getRankTextColor(index + 1)} relative`}>
                      {getRankIcon(index + 1) || (index + 1)}
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 blur-sm"></div>
                    </div>
                    
                    {/* Donor information */}
                    <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800 group-hover:text-brand-primary transition-colors duration-300 break-words leading-tight">
                        {donor.donor_name}
                      </h3>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                        <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 shadow-md flex-shrink-0">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-brand-primary" />
                        </div>
                        <span className="font-semibold break-words leading-tight">
                          ~{donor.lives_impacted} lives impacted
                        </span>
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-brand-secondary animate-pulse flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Donation amount */}
                  <div className="text-center sm:text-right flex-shrink-0">
                    <p className="text-2xl sm:text-3xl font-black text-brand-secondary group-hover:text-brand-secondary-dark transition-colors duration-300 drop-shadow-sm">
                      ${donor.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-secondary/50 to-transparent" />
              </div>
            ))}
          </div>
        )}
        
        {/* Enhanced footer */}
        {monthlyDonors.length > 0 && (
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gradient-to-r from-brand-primary/20 via-brand-secondary/20 to-brand-primary/20">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">
                Rankings are updated in real-time
              </p>
              <div className="flex items-center justify-center gap-2 text-brand-secondary">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm font-semibold">Thank you for your generosity!</span>
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}