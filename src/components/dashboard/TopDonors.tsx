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
            {/* Districts Needing Support Section - Enhanced Design */}
            {districts.length >= 3 && (
              <div className="mb-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 shadow-lg">
                    <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">Districts Needing Support</h3>
                      <p className="text-gray-600">Help these areas reach more children</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 3rd from Bottom */}
                  <div className="group relative overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 opacity-90"></div>
                    <div className="relative p-6 text-white">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <span className="text-lg font-bold">#{districts.length - 2}</span>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm inline-block">
                          <span className="text-sm font-medium">Needs Support</span>
                        </div>
                      </div>
                      
                      <h4 className="text-2xl font-bold mb-3 text-center">{districts[districts.length - 3]?.district_name}</h4>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold mb-2">${(districts[districts.length - 3]?.total_amount / 100).toLocaleString()}</div>
                        <p className="text-sm text-white/80">Total donations received</p>
                      </div>
                      
                      <div className="text-center p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                        <p className="text-xl font-bold mb-2">More children could be helped here!</p>
                        <p className="text-white/90">Every donation helps more children in need</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* 2nd from Bottom */}
                  <div className="group relative overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-red-600 opacity-90"></div>
                    <div className="relative p-6 text-white">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <span className="text-lg font-bold">#{districts.length - 1}</span>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm inline-block">
                          <span className="text-sm font-medium">Urgent Need</span>
                        </div>
                      </div>
                      
                      <h4 className="text-2xl font-bold mb-3 text-center">{districts[districts.length - 2]?.district_name}</h4>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold mb-2">${(districts[districts.length - 2]?.total_amount / 100).toLocaleString()}</div>
                        <p className="text-sm text-white/80">Total donations received</p>
                      </div>
                      
                      <div className="text-center p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                        <p className="text-xl font-bold mb-2">More children could be helped here!</p>
                        <p className="text-white/90">Every donation helps more children in need</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom District */}
                  <div className="group relative overflow-hidden rounded-2xl border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800 opacity-90"></div>
                    <div className="relative p-6 text-white">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <span className="text-lg font-bold">#{districts.length}</span>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm inline-block">
                          <span className="text-sm font-medium">Critical Need</span>
                        </div>
                      </div>
                      
                      <h4 className="text-2xl font-bold mb-3 text-center">{districts[districts.length - 1]?.district_name}</h4>
                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold mb-2">${(districts[districts.length - 1]?.total_amount / 100).toLocaleString()}</div>
                        <p className="text-sm text-white/80">Total donations received</p>
                      </div>
                      
                      <div className="text-center p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                        <p className="text-xl font-bold mb-2">More children could be helped here!</p>
                        <p className="text-white/90">Every donation helps more children in need</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Call to Action */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200 shadow-lg">
                    <div className="p-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-orange-800">These districts need your help to reach more children!</p>
                      <p className="text-orange-600 mt-1">Consider supporting these areas to maximize your impact</p>
                    </div>
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
                     <Card key={district.district_name} className={`${cardStyle} border hover:shadow-md transition-all duration-200 relative overflow-hidden`}>
                       <CardContent className="p-5">
                         {/* Special Background Pattern for Bottom 3 */}
                         {isBottomPerformer && (
                           <div className="absolute inset-0 opacity-5">
                             <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500"></div>
                           </div>
                         )}
                         
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
                         
                         {/* Achievement/Status for Top 3 - Moved to top */}
                         {index <= 2 && (
                           <div className="mb-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg">
                             <div className="text-center">
                               <div className="flex items-center justify-center gap-2 mb-2">
                                 {index === 0 && <Crown className="h-6 w-6 text-yellow-600" />}
                                 {index === 1 && <Medal className="h-6 w-6 text-gray-600" />}
                                 {index === 2 && <Trophy className="h-6 w-6 text-amber-600" />}
                               </div>
                               <p className="text-lg font-medium text-green-800">
                                 {index === 0 ? 'Changing lives!' : index === 1 ? 'Making a difference!' : 'Helping children!'}
                               </p>
                               <p className="text-sm text-green-600 mt-1">
                                 {index === 0 ? 'Every child deserves this support' : 
                                  index === 1 ? `${district.lives_impacted} children thriving` :
                                  `${district.lives_impacted} children growing`}
                               </p>
                             </div>
                           </div>
                         )}
                         
                         {/* Special Attention for Bottom 3 - Moved to top */}
                         {isBottomPerformer && (
                           <div className="mb-4 p-3 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg">
                             <div className="text-center">
                               <div className="flex items-center justify-center gap-2 mb-2">
                                 <AlertCircle className="h-6 w-6 text-orange-600" />
                               </div>
                               <p className="text-lg font-medium text-orange-800">
                                 More children could be helped here!
                               </p>
                               <p className="text-sm text-orange-600 mt-1">
                                 Every donation helps more children in need
                               </p>
                             </div>
                           </div>
                         )}
                         
                         {/* District Stats with Comparison */}
                         <div className="grid grid-cols-3 gap-3 text-sm">
                           <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-100">
                             <div className="flex items-center justify-center gap-1 mb-2">
                               <Users className="h-4 w-4 text-blue-500" />
                               <span className="font-medium text-gray-600 text-xs">Donors</span>
                             </div>
                             <span className="text-xl font-bold text-blue-600">{district.donation_count}</span>
                           </div>
                           
                           <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-100">
                             <div className="flex items-center justify-center gap-1 mb-2">
                               <Users className="h-4 w-4 text-purple-500" />
                               <span className="font-medium text-gray-600 text-xs">Lives</span>
                             </div>
                             <span className="text-xl font-bold text-purple-600">{district.lives_impacted}</span>
                           </div>
                           
                           <div className="text-center p-3 bg-white/60 rounded-lg border border-gray-100">
                             <div className="flex items-center justify-center gap-1 mb-2">
                               <DollarSign className="h-5 w-5 text-green-500" />
                               <span className="font-medium text-gray-600 text-xs">Total</span>
                             </div>
                             <span className="text-xl font-bold text-green-600">${district.total_amount.toLocaleString()}</span>
                             {/* Percentage of Leader for Total Amount */}
                             {index > 0 && (
                               <div className="text-xs text-gray-500 mt-1">
                                 {((district.total_amount / districts[0]?.total_amount) * 100).toFixed(1)}% of leader
                               </div>
                             )}
                           </div>
                         </div>
                         
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