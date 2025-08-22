import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopDonors } from "@/components/dashboard/TopDonors";
import { MonthlyRankings } from "@/components/dashboard/MonthlyRankings";
import { RecentDonations } from "@/components/dashboard/RecentDonations";
import { HongKongHeatmap } from "@/components/dashboard/HongKongHeatmap";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Donor Dashboard</h1>
        <p className="text-muted-foreground">
          See the incredible impact our donor community is making across Hong Kong
        </p>
      </div>

      <Tabs defaultValue="top-donors" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="top-donors">Top Donors</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Rankings</TabsTrigger>
          <TabsTrigger value="recent">Recent Donations</TabsTrigger>
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
  );
}