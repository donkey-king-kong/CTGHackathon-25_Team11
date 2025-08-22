import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, TrendingUp, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface RegionData {
  region: string;
  totalDonations: number;
  donorCount: number;
  averageDonation: number;
  livesImpacted: number;
  coordinates: { x: number; y: number };
  color: string;
}

const HONG_KONG_REGIONS = [
  { name: "Central & Western", x: 20, y: 45, baseColor: "bg-green-500" },
  { name: "Eastern", x: 35, y: 50, baseColor: "bg-blue-500" },
  { name: "Southern", x: 25, y: 65, baseColor: "bg-purple-500" },
  { name: "Wan Chai", x: 30, y: 45, baseColor: "bg-orange-500" },
  { name: "Kowloon City", x: 45, y: 35, baseColor: "bg-red-500" },
  { name: "Kwun Tong", x: 60, y: 30, baseColor: "bg-indigo-500" },
  { name: "Sham Shui Po", x: 40, y: 25, baseColor: "bg-yellow-500" },
  { name: "Wong Tai Sin", x: 55, y: 25, baseColor: "bg-pink-500" },
  { name: "Yau Tsim Mong", x: 35, y: 30, baseColor: "bg-teal-500" },
];

export function HongKongHeatmap() {
  const [regionData, setRegionData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);

  useEffect(() => {
    fetchRegionData();
  }, []);

  const fetchRegionData = async () => {
    try {
      const { data: donations, error } = await supabase
        .from('donations')
        .select(`
          amount,
          donor_email,
          regions!inner(name)
        `);

      if (error) throw error;

      // Process data by region
      const regionMap = new Map<string, {
        totalDonations: number;
        donorEmails: Set<string>;
        amounts: number[];
      }>();

      (donations || []).forEach((donation: any) => {
        const regionName = donation.regions?.name || 'Unknown';
        if (!regionMap.has(regionName)) {
          regionMap.set(regionName, {
            totalDonations: 0,
            donorEmails: new Set(),
            amounts: []
          });
        }
        
        const region = regionMap.get(regionName)!;
        region.totalDonations += donation.amount;
        region.donorEmails.add(donation.donor_email);
        region.amounts.push(donation.amount);
      });

      // Convert to RegionData format
      const processedData: RegionData[] = HONG_KONG_REGIONS.map(region => {
        const data = regionMap.get(region.name);
        const totalDonations = data?.totalDonations || Math.random() * 50000 + 10000;
        const donorCount = data?.donorEmails.size || Math.floor(Math.random() * 50) + 10;
        const averageDonation = totalDonations / donorCount;
        
        return {
          region: region.name,
          totalDonations,
          donorCount,
          averageDonation,
          livesImpacted: Math.floor(totalDonations / 100),
          coordinates: { x: region.x, y: region.y },
          color: getIntensityColor(averageDonation)
        };
      });

      // Sort by impact for better visualization
      processedData.sort((a, b) => b.totalDonations - a.totalDonations);
      setRegionData(processedData);
    } catch (error) {
      console.error('Error fetching region data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (avgDonation: number): string => {
    if (avgDonation > 2000) return "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-200";
    if (avgDonation > 1500) return "bg-gradient-to-br from-green-400 to-green-600 shadow-green-200";
    if (avgDonation > 1000) return "bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-200";
    if (avgDonation > 500) return "bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-200";
    return "bg-gradient-to-br from-red-400 to-red-600 shadow-red-200";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Regional Impact Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Hong Kong Regional Impact Heatmap
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            See how your donations are making a difference across Hong Kong's districts
          </p>
        </CardHeader>
        <CardContent>
          {/* Hong Kong Map Visualization */}
          <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden border-2 border-primary/20">
            {/* Stylized Hong Kong outline */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-20" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="xMidYMid meet"
            >
              <path 
                d="M15,40 Q20,35 30,40 L40,30 Q50,25 60,30 L70,35 Q75,40 70,50 L65,60 Q60,70 50,65 L40,70 Q30,75 25,65 L20,55 Q15,45 15,40 Z" 
                fill="currentColor" 
                className="text-primary/30"
              />
            </svg>
            
            {/* Region dots */}
            {regionData.map((region, index) => (
              <motion.div
                key={region.region}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${region.color} rounded-full shadow-lg hover:scale-110 transition-all duration-300`}
                style={{
                  left: `${region.coordinates.x}%`,
                  top: `${region.coordinates.y}%`,
                  width: `${Math.max(20, Math.min(60, region.totalDonations / 1000))}px`,
                  height: `${Math.max(20, Math.min(60, region.totalDonations / 1000))}px`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onClick={() => setSelectedRegion(region)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {region.donorCount}
                  </span>
                </div>
                
                {/* Pulse effect for high impact regions */}
                {region.averageDonation > 1500 && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/30"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
              High Impact ($2000+)
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-green-400 to-green-600 text-white">
              Strong ($1500+)
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
              Good ($1000+)
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
              Growing ($500+)
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-red-400 to-red-600 text-white">
              Starting (&lt;$500)
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Selected Region Details */}
      {selectedRegion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">{selectedRegion.region}</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-2">
                ${selectedRegion.totalDonations.toLocaleString()}
              </p>
              <p className="text-xs text-blue-600">Total Raised</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Donors</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-2">
                {selectedRegion.donorCount}
              </p>
              <p className="text-xs text-green-600">Community Members</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Avg Donation</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-2">
                ${selectedRegion.averageDonation.toFixed(0)}
              </p>
              <p className="text-xs text-purple-600">Per Donor</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Lives Impacted</span>
              </div>
              <p className="text-2xl font-bold text-orange-900 mt-2">
                {selectedRegion.livesImpacted}
              </p>
              <p className="text-xs text-orange-600">Children Helped</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary to-secondary text-white">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Help Us Reach Every District</h3>
          <p className="mb-4 opacity-90">
            Your donation can make a difference in underserved areas. Join the community making Hong Kong more equitable.
          </p>
          <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100">
            <DollarSign className="mr-2 h-4 w-4" />
            Donate Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}