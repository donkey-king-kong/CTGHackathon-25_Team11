import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface RegionData {
  region: string;
  totalDonations: number;
  donorCount: number;
  averageDonation: number;
  livesImpacted: number;
}

export function RegionalHeatmap() {
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegionalData = async () => {
      try {
        // First get donations data
        const { data: donationsData, error } = await supabase
          .from('donations')
          .select('donor_name, amount, lives_impacted');

        if (error) throw error;

        // For demo purposes, assign random regions to donations
        const regions = ['Central', 'Wan Chai', 'Tsim Sha Tsui', 'Causeway Bay', 'Mong Kok', 'Sha Tin', 'Tuen Mun'];
        
        const regionMap = new Map<string, RegionData>();

        donationsData?.forEach((donation) => {
          // Assign a consistent region based on donor name hash
          const regionIndex = Math.abs(donation.donor_name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % regions.length;
          const region = regions[regionIndex];
          
          const existing = regionMap.get(region);
          if (existing) {
            existing.totalDonations += Number(donation.amount);
            existing.donorCount += 1;
            existing.livesImpacted += donation.lives_impacted;
          } else {
            regionMap.set(region, {
              region,
              totalDonations: Number(donation.amount),
              donorCount: 1,
              averageDonation: 0,
              livesImpacted: donation.lives_impacted,
            });
          }
        });

        // Calculate average donations and sort by impact density
        const processedData = Array.from(regionMap.values()).map(region => ({
          ...region,
          averageDonation: region.totalDonations / region.donorCount,
        })).sort((a, b) => (b.totalDonations / b.donorCount) - (a.totalDonations / a.donorCount));

        setRegionData(processedData);
      } catch (error) {
        console.error('Error fetching regional data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionalData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regional Impact Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIntensityColor = (averageDonation: number, maxAverage: number) => {
    const intensity = averageDonation / maxAverage;
    if (intensity > 0.8) return 'from-red-500/20 to-red-300/10 border-red-200';
    if (intensity > 0.6) return 'from-orange-500/20 to-orange-300/10 border-orange-200';
    if (intensity > 0.4) return 'from-yellow-500/20 to-yellow-300/10 border-yellow-200';
    if (intensity > 0.2) return 'from-green-500/20 to-green-300/10 border-green-200';
    return 'from-blue-500/20 to-blue-300/10 border-blue-200';
  };

  const maxAverage = Math.max(...regionData.map(r => r.averageDonation));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Regional Impact Heatmap
        </CardTitle>
        <CardDescription>
          Donation density across Hong Kong regions (weighted by amount donated ÷ number of donors)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {regionData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No regional data available yet.</p>
        ) : (
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>Intensity by avg. donation per donor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-red-500 rounded"></div>
                <span>Low → High</span>
              </div>
            </div>

            {/* Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionData.map((region) => (
                <div 
                  key={region.region}
                  className={`p-4 rounded-lg border bg-gradient-to-br ${getIntensityColor(region.averageDonation, maxAverage)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{region.region}</h3>
                    <div className="text-right">
                      <p className="text-sm font-medium">${region.averageDonation.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">avg/donor</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-medium">${region.totalDonations.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Donors</p>
                      <p className="font-medium">{region.donorCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lives</p>
                      <p className="font-medium">{region.livesImpacted}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Regions with higher average donations per donor appear "hotter" on the map
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}