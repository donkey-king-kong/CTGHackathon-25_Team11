import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopDonors } from "@/components/dashboard/TopDonors";
import { MonthlyRankings } from "@/components/dashboard/MonthlyRankings";
import { RecentDonations } from "@/components/dashboard/RecentDonations";
import { HongKongChoropleth } from "@/components/dashboard/HongKongChoropleth";

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <section className="pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl mb-6 sm:mb-8">
            <span className="text-white text-3xl sm:text-4xl">🏆</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight">
            Donor Leaderboard
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            See who's making the biggest impact and track your ranking among our generous community
          </p>
        </div>
      </section>

      {/* Leaderboard Content */}
      <section className="pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <Tabs defaultValue="top-donors" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-1 mb-6 sm:mb-8 h-auto min-h-[44px] sm:min-h-[40px]">
              <TabsTrigger value="top-donors" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap leading-tight">
                Top Donors
              </TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap leading-tight">
                Monthly Rankings
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap leading-tight">
                Recent Activity
              </TabsTrigger>
              <TabsTrigger value="regional" className="text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-1.5 whitespace-nowrap leading-tight">
                Regional Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="top-donors" className="space-y-4 sm:space-y-6">
              <TopDonors />
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4 sm:space-y-6">
              <MonthlyRankings />
            </TabsContent>

            <TabsContent value="recent" className="space-y-4 sm:space-y-6">
              <RecentDonations />
            </TabsContent>

            <TabsContent value="regional" className="space-y-4 sm:space-y-6">
              <HongKongChoropleth />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
