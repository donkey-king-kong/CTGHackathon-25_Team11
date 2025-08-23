import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Crown, Medal, MapPin, TrendingUp, Users, DollarSign, Award, AlertCircle, TrendingDown } from "lucide-react";
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

  const getRankLabel = (index: number) => {
    if (index === 0) return '1st';
    if (index === 1) return '2nd';
    if (index === 2) return '3rd';
    return `${index + 1}th`;
  };

  const getDistrictStatus = (index: number, totalDistricts: number) => {
    if (index <= 2) return 'top-performer';
    if (index >= totalDistricts - 3) return 'needs-support';
    return 'mid-tier';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'top-performer': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'needs-support': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      default: return <TrendingDown className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'top-performer': return 'from-green-50 to-emerald-50 border-green-200';
      case 'needs-support': return 'from-orange-50 to-red-50 border-orange-200';
      default: return 'from-blue-50 to-slate-50 border-blue-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'top-performer': return 'Top Performer';
      case 'needs-support': return 'Needs Support';
      default: return 'Mid Tier';
    }
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

            {/* District Cards Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 All Districts</h3>
              
              {/* Top Performers Section */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-green-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Top Performers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {districts.slice(0, 3).map((district, index) => (
                    <Card key={district.district_name} className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {index === 0 && <Crown className="h-5 w-5 text-yellow-500" />}
                            {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                            {index === 2 && <Trophy className="h-5 w-5 text-amber-600" />}
                            <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Top Performer</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{district.district_name}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Donors:</span>
                            <span className="font-medium">{district.donation_count}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Lives Impacted:</span>
                            <span className="font-medium">{district.lives_impacted}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-bold text-green-600">${district.total_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Districts Needing Support Section */}
              {districts.length > 3 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-orange-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Districts Needing Support
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {districts.slice(-3).reverse().map((district, index) => {
                      const actualIndex = districts.length - 1 - index;
                      return (
                        <Card key={district.district_name} className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:shadow-md transition-all duration-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-orange-600">#{actualIndex + 1}</span>
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Needs Support</span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">{district.district_name}</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Donors:</span>
                                <span className="font-medium">{district.donation_count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Lives Impacted:</span>
                                <span className="font-medium">{district.lives_impacted}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total:</span>
                                <span className="font-bold text-orange-600">${district.total_amount.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-700">
                              💡 This district could benefit from more donor outreach
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mid Tier Districts */}
              {districts.length > 6 && (
                <div>
                  <h4 className="text-md font-medium text-blue-700 mb-3 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Mid Tier Districts
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {districts.slice(3, -3).map((district, index) => (
                      <Card key={district.district_name} className="bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-blue-600">#{index + 4}</span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Mid Tier</span>
                          </div>
                          <h3 className="font-semibold text-gray-800 mb-2">{district.district_name}</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Donors:</span>
                              <span className="font-medium">{district.donation_count}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lives Impacted:</span>
                              <span className="font-medium">{district.lives_impacted}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total:</span>
                              <span className="font-bold text-blue-600">${district.total_amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}