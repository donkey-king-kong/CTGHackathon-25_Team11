import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Donor {
  donor_name: string;
  total_amount: number;
  lives_impacted: number;
  donation_count: number;
}

export function TopDonors() {
  console.log('TopDonors component is running!');
  
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect is running!');
    const fetchTopDonors = async () => {
      console.log('fetchTopDonors function started!');
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('donor_name, amount, lives_impacted')
          .order('amount', { ascending: false });

        console.log('Supabase response:', { data, error });
        console.log('Data length:', data?.length);

        if (error) throw error;

        // Aggregate donations by donor
        const donorMap = new Map<string, Donor>();
        
        data?.forEach((donation) => {
          const existing = donorMap.get(donation.donor_name);
          if (existing) {
            existing.total_amount += Number(donation.amount);
            existing.lives_impacted += donation.lives_impacted;
            existing.donation_count += 1;
          } else {
            donorMap.set(donation.donor_name, {
              donor_name: donation.donor_name,
              total_amount: Number(donation.amount),
              lives_impacted: donation.lives_impacted,
              donation_count: 1,
            });
          }
        });

        const sortedDonors = Array.from(donorMap.values())
          .sort((a, b) => b.lives_impacted - a.lives_impacted)
          .slice(0, 10);

        setDonors(sortedDonors);
      } catch (error) {
        console.error('Error fetching top donors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Donors by Lives Impacted</CardTitle>
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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1: return <Medal className="h-5 w-5 text-gray-400" />;
      case 2: return <Trophy className="h-5 w-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{index + 1}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Donors by Lives Impacted
        </CardTitle>
        <CardDescription>
          Our most impactful donors, ranked by the number of children's lives they've touched
        </CardDescription>
      </CardHeader>
      <CardContent>
        {donors.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No donor data available yet.</p>
        ) : (
          <div className="space-y-4">
            {donors.map((donor, index) => (
              <div 
                key={donor.donor_name} 
                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-muted/30 to-transparent"
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(index)}
                  <div>
                    <p className="font-medium">{donor.donor_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {donor.donation_count} donation{donor.donation_count > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {donor.lives_impacted} lives
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ${donor.total_amount.toLocaleString()}
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