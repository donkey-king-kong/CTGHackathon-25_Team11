import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
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

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Donations
        </CardTitle>
        <CardDescription>
          Latest contributions from our generous donor community
        </CardDescription>
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No donations recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <div 
                key={donation.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-accent/20 to-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/30 rounded-full">
                    <Heart className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{donation.donor_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatTimeAgo(donation.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${Number(donation.amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {donation.lives_impacted} lives impacted
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {donations.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Showing the {donations.length} most recent donations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}