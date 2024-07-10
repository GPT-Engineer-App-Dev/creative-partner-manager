import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDesignPartners } from "@/integrations/supabase";

const Dashboard = () => {
  const { data: partners, isLoading, isError } = useDesignPartners();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading dashboard data</div>;

  const stages = [
    { name: "Design", count: partners.filter(p => p.stage === "Design").length },
    { name: "Development", count: partners.filter(p => p.stage === "Development").length },
    { name: "Testing", count: partners.filter(p => p.stage === "Testing").length },
    { name: "Completed", count: partners.filter(p => p.stage === "Completed").length },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Design Partners CMS</h1>
      <p className="text-lg mb-8">
        Track and manage your design partners through various stages of the process.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <Card key={stage.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stage.count}</div>
              <p className="text-xs text-muted-foreground">
                partners in this stage
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;