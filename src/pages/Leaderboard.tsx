import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopDonors } from "@/components/dashboard/TopDonors";
import { MonthlyRankings } from "@/components/dashboard/MonthlyRankings";
import { RecentDonations } from "@/components/dashboard/RecentDonations";
import { HongKongHeatmap } from "@/components/dashboard/HongKongHeatmap";

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl mb-8">
            <span className="text-white text-4xl">🏆</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Donor Leaderboard
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See who's making the biggest impact and track your ranking among our generous community
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="top-donors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="top-donors">Top Donors</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Rankings</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="regional">Regional Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="top-donors" className="space-y-6">
              <TopDonors />
            </TabsContent>

            <TabsContent value="monthly" className="space-y-6">
              <MonthlyRankings />
            </TabsContent>

            <TabsContent value="recent" className="space-y-6">
              <RecentDonations />
            </TabsContent>

            <TabsContent value="regional" className="space-y-6">
              <HongKongHeatmap />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
