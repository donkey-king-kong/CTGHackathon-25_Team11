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
            Hong Kong districts ranked by total donations amount
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
          Hong Kong districts ranked by total donations amount
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
            {/* Districts Needing Support Section - Replacing Podium */}
            {districts.length >= 3 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-orange-700 mb-4 text-center flex items-center justify-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Districts Needing Support
                </h3>
                <div className="flex items-end justify-center gap-4">
                  {/* 3rd from Bottom */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-24 bg-gradient-to-b from-orange-300 to-orange-400 border-2 border-orange-200 rounded-t-lg flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-bold text-orange-700">#{districts.length - 2}</p>
                      <p className="text-sm text-gray-600 font-medium">{districts[districts.length - 3]?.district_name}</p>
                      <p className="text-lg font-bold text-orange-800">${districts[districts.length - 3]?.total_amount.toLocaleString()}</p>
                      <p className="text-xs text-orange-600">Needs donors</p>
                    </div>
                  </div>
                  
                  {/* 2nd from Bottom */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-28 bg-gradient-to-b from-red-400 to-red-500 border-2 border-red-300 rounded-t-lg flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-bold text-red-700">#{districts.length - 1}</p>
                      <p className="text-sm text-gray-600 font-medium">{districts[districts.length - 2]?.district_name}</p>
                      <p className="text-lg font-bold text-red-800">${districts[districts.length - 2]?.total_amount.toLocaleString()}</p>
                      <p className="text-xs text-red-600">Urgent need</p>
                    </div>
                  </div>
                  
                  {/* Bottom District */}
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-32 bg-gradient-to-b from-red-600 to-red-700 border-2 border-red-500 rounded-t-lg flex items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center mt-2">
                      <p className="font-bold text-red-800">#{districts.length}</p>
                      <p className="text-sm text-gray-600 font-medium">{districts[districts.length - 1]?.district_name}</p>
                      <p className="text-xl font-bold text-red-900">${districts[districts.length - 1]?.total_amount.toLocaleString()}</p>
                      <p className="text-xs text-red-700">Critical support needed</p>
                    </div>
                  </div>
                </div>
                
                {/* Call to Action */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">These districts need your help to reach more children!</span>
                  </div>
                </div>
              </div>
            )}

            {/* District Cards Grid */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 All Districts</h3>
              
              {/* Single Ranked List of All Districts */}
              <div className="space-y-3">
                {districts.map((district, index) => {
                  const isTopPerformer = index <= 2;
                  const isBottomPerformer = index >= districts.length - 3;
                  const isMidTier = !isTopPerformer && !isBottomPerformer;
                  
                  let cardStyle = '';
                  let statusBadge = '';
                  let statusColor = '';
                  
                  if (isTopPerformer) {
                    cardStyle = 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200';
                    statusBadge = '';
                    statusColor = '';
                  } else if (isBottomPerformer) {
                    cardStyle = 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200';
                    statusBadge = 'Needs Support';
                    statusColor = 'bg-orange-100 text-orange-700';
                  } else {
                    cardStyle = 'bg-gradient-to-r from-blue-50 to-slate-50 border-blue-200';
                    statusBadge = '';
                    statusColor = '';
                  }
                  
                  return (
                                         <Card key={district.district_name} className={`${cardStyle} border hover:shadow-md transition-all duration-200`}>
                       <CardContent className="p-5">
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-4">
                             {/* Rank with Icon */}
                             <div className="flex items-center gap-3">
                               {index === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                               {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                               {index === 2 && <Trophy className="h-6 w-6 text-amber-600" />}
                               <div className={`
                                 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shadow-sm
                                 ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                                   index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                                   index === 2 ? 'bg-gradient-to-r from-amber-600 to-orange-600' :
                                   'bg-gradient-to-r from-slate-400 to-slate-500'}
                               `}>
                                 {index + 1}
                               </div>
                             </div>
                             
                             {/* District Name */}
                             <div>
                               <h3 className="text-lg font-semibold text-gray-800">{district.district_name}</h3>
                               <p className="text-sm text-gray-500">{getRankLabel(index)} place</p>
                             </div>
                           </div>
                           
                           {/* Status Badge - Only show if exists */}
                           {statusBadge && (
                             <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusColor}`}>
                               {statusBadge}
                             </span>
                           )}
                         </div>
                        
                                                 {/* District Stats */}
                         <div className="grid grid-cols-3 gap-2 text-sm">
                           <div className="text-center p-2 bg-white/50 rounded-lg">
                             <div className="flex items-center justify-center gap-1 mb-1">
                               <Users className="h-4 w-4 text-blue-500" />
                               <span className="font-medium text-gray-600 text-xs">Donors</span>
                             </div>
                             <span className="text-lg font-bold text-blue-600">{district.donation_count}</span>
                           </div>
                           
                           <div className="text-center p-2 bg-white/50 rounded-lg">
                             <div className="flex items-center justify-center gap-1 mb-1">
                               <Users className="h-4 w-4 text-purple-500" />
                               <span className="font-medium text-gray-600 text-xs">Lives</span>
                             </div>
                             <span className="text-lg font-bold text-purple-600">{district.lives_impacted}</span>
                           </div>
                           
                           <div className="text-center p-2 bg-white/50 rounded-lg">
                             <div className="flex items-center justify-center gap-1 mb-1">
                               <DollarSign className="h-4 w-4 text-green-500" />
                               <span className="font-medium text-gray-600 text-xs">Total</span>
                             </div>
                             <span className="text-lg font-bold text-green-600">${district.total_amount.toLocaleString()}</span>
                             {/* Percentage of Leader for Context */}
                             {index > 0 && (
                               <div className="text-xs text-gray-500 mt-1">
                                 {((district.total_amount / districts[0]?.total_amount) * 100).toFixed(1)}% of leader
                               </div>
                             )}
                           </div>
                         </div>
                         
                         {/* Special Message for Bottom Performers */}
                         {isBottomPerformer && (
                           <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-700">
                             💡 This district could benefit from more donor outreach
                           </div>
                         )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}