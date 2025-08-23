import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, Trophy, Medal, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    if (rank === 1) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />;
    return null;
  };

  const getRankBackground = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-br from-amber-500 to-amber-700 text-white";
    return "bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/30 text-brand-secondary-dark border border-brand-secondary/30";
  };

  if (loading) {
    return (
      <Card className="overflow-hidden border-0 shadow-card">
        <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <Calendar className="h-6 w-6 text-brand-primary" />
            </div>
            Monthly Donor Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted/50 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-card">
      <CardHeader className="bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border-b border-border/50">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
          <div className="p-2 rounded-lg bg-brand-primary/10">
            <Calendar className="h-6 w-6 text-brand-primary" />
          </div>
          Monthly Donor Rankings
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground mt-2">
          Top contributors for {currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {monthlyDonors.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No donations recorded for this month yet.</p>
            <p className="text-muted-foreground/70 text-sm mt-1">Be the first to make a difference!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthlyDonors.map((donor, index) => (
              <div 
                key={`${donor.donor_name}-${index}`}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-surface to-surface-soft p-5 transition-all duration-300 hover:shadow-elevated hover:border-brand-secondary/30 hover:scale-[1.02]"
              >
                {/* Background accent on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Enhanced rank indicator */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg shadow-sm ${getRankBackground(index + 1)}`}>
                      {getRankIcon(index + 1) || (index + 1)}
                    </div>
                    
                    {/* Donor information */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-brand-primary transition-colors duration-200">
                        {donor.donor_name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="p-1 rounded-full bg-brand-primary/10">
                          <TrendingUp className="h-3 w-3 text-brand-primary" />
                        </div>
                        <span className="font-medium">
                          ~{donor.lives_impacted} lives impacted
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Donation amount */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-secondary group-hover:text-brand-secondary-dark transition-colors duration-200">
                      ${donor.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      this month
                    </p>
                  </div>
                </div>
                
                {/* Subtle bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
              </div>
            ))}
          </div>
        )}
        
        {/* Footer with additional info */}
        {monthlyDonors.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Rankings are updated in real-time • Thank you for your generosity!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}