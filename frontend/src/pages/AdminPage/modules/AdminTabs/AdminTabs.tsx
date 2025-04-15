import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsTab from "../../components/Analytics/AnalyticsTab";
import VerificationTab from "../../components/Verification/VerificationTab";


const AdminTabs = () => {
  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="bg-background">
        <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        <TabsTrigger value="verification">Верификация</TabsTrigger>
      </TabsList>
      
      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="verification">
        <VerificationTab />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;