import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown, Medal, MapPin, TrendingUp, Users, DollarSign, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface District {
  district_name: string;
  total_amount: number;
  lives_impacted: number;
  donation_count: number;
}

export function TopDonors() {
  console.log('TopDonors component is running!');
  
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useEffect is running!');
    const fetchTopDistricts = async () => {
      console.log('fetchTopDistricts function started!');
      try {
        // Join donations with regions to get district information
        const { data, error } = await supabase
          .from('donations')
          .select(`
            amount,
            lives_impacted,
            region_id,
            regions!inner(name)
          `)
          .order('amount', { ascending: false });

        console.log('Supabase response:', { data, error });
        console.log('Data length:', data?.length);

        if (error) throw error;

        // Aggregate donations by district
        const districtMap = new Map<string, District>();
        
        data?.forEach((donation) => {
          const regionName = donation.regions?.name;
          if (!regionName) return;
          
          const existing = districtMap.get(regionName);
          if (existing) {
            existing.total_amount += Number(donation.amount);
            existing.lives_impacted += donation.lives_impacted;
            existing.donation_count += 1;
          } else {
            districtMap.set(regionName, {
              district_name: regionName,
              total_amount: Number(donation.amount),
              lives_impacted: donation.lives_impacted,
              donation_count: 1,
            });
          }
        });

        const sortedDistricts = Array.from(districtMap.values())
          .sort((a, b) => b.total_amount - a.total_amount);

        setDistricts(sortedDistricts);
      } catch (error) {
        console.error('Error fetching top districts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopDistricts();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Award className="h-6 w-6" />
            </div>
            District Leaderboard
            </CardTitle>
          <CardDescription className="text-emerald-100 text-lg">
            Hong Kong districts ranked by total donations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPodiumPosition = (index: number) => {
    if (index === 0) return { height: 'h-32', bg: 'from-yellow-400 to-amber-500', border: 'border-yellow-300' };
    if (index === 1) return { height: 'h-28', bg: 'from-gray-300 to-gray-400', border: 'border-gray-200' };
    if (index === 2) return { height: 'h-24', bg: 'from-amber-600 to-orange-600', border: 'border-amber-500' };
    return { height: 'h-20', bg: 'from-slate-100 to-slate-200', border: 'border-slate-300' };
  };

  const getRankLabel = (index: number) => {
    if (index === 0) return '1st';
    if (index === 1) return '2nd';
    if (index === 2) return '3rd';
    return `${index + 1}th`;
  };

  return (
    <Card className="bg-white border-0 shadow-lg overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Award className="h-6 w-6" />
          </div>
          District Leaderboard
        </CardTitle>
        <CardDescription className="text-emerald-100 text-lg">
          Hong Kong districts ranked by total donations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {districts.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No district data available yet.</p>
            <p className="text-gray-400 text-sm">Donations will appear here once they're received.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Podium Section for Top 3 */}
            {districts.length >= 3 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">🏆 Podium Winners</h3>
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-28 bg-gradient-to-b from-gray-300 to-gray-400 border-2 border-gray-200 rounded-t-lg flex items-center justify-center">
                      <Medal className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-bold text-gray-700">2nd</p>
                      <p className="text-sm text-gray-600 font-medium">{districts[1]?.district_name}</p>
                      <p className="text-lg font-bold text-gray-800">${(districts[1]?.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* 1st Place */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-32 bg-gradient-to-b from-yellow-400 to-amber-500 border-2 border-yellow-300 rounded-t-lg flex items-center justify-center">
                      <Crown className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-bold text-amber-600">1st</p>
                      <p className="text-sm text-gray-600 font-medium">{districts[0]?.district_name}</p>
                      <p className="text-xl font-bold text-amber-700">${(districts[0]?.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* 3rd Place */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-24 bg-gradient-to-b from-amber-600 to-orange-600 border-2 border-amber-500 rounded-t-lg flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-bold text-amber-700">3rd</p>
                      <p className="text-sm text-gray-600 font-medium">{districts[2]?.district_name}</p>
                      <p className="text-lg font-bold text-amber-800">${(districts[2]?.total_amount).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table for All Districts */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Complete Rankings</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 mb-3 px-4">
                  <div className="col-span-1">Rank</div>
                  <div className="col-span-4">District</div>
                  <div className="col-span-2 text-center">Donations</div>
                  <div className="col-span-2 text-center">Lives Impacted</div>
                  <div className="col-span-3 text-right">Total Amount</div>
                </div>
                
                <div className="space-y-2">
                  {districts.map((district, index) => (
                    <div 
                      key={district.district_name} 
                      className={`
                        grid grid-cols-12 gap-4 items-center p-4 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-sm
                        ${index <= 2 ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200' : 'bg-white border border-gray-100'}
                      `}
                    >
                      {/* Rank */}
                      <div className="col-span-1">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white
                          ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
                            'bg-gradient-to-r from-slate-400 to-slate-500'}
                        `}>
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* District Name */}
                      <div className="col-span-4">
                        <p className="font-semibold text-gray-800">{district.district_name}</p>
                        <p className="text-xs text-gray-500">{getRankLabel(index)} place</p>
                      </div>
                      
                      {/* Donation Count */}
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{district.donation_count}</span>
                        </div>
                      </div>
                      
                      {/* Lives Impacted */}
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{district.lives_impacted}</span>
                        </div>
                      </div>
                      
                      {/* Total Amount */}
                      <div className="col-span-3 text-right">
                        <p className="text-lg font-bold text-green-600">
                          ${(district.total_amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {((district.total_amount / districts[0]?.total_amount) * 100).toFixed(1)}% of leader
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}