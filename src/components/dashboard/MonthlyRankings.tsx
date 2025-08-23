import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Donor Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Monthly Donor Rankings
        </CardTitle>
        <CardDescription>
          Top contributors for {currentMonth}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {monthlyDonors.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No donations recorded for this month yet.</p>
        ) : (
          <div className="space-y-4">
            {monthlyDonors.map((donor, index) => (
              <div 
                key={`${donor.donor_name}-${index}`}
                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-secondary/10 to-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/20 text-secondary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{donor.donor_name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>{donor.lives_impacted} lives impacted</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary">
                    ${donor.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    this month
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}