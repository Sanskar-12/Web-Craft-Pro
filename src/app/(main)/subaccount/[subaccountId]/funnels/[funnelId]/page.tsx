import BlurPage from "@/components/blur-page/blur-page";
import { getFunnel } from "@/lib/queries";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FunnelSettings from "@/components/funnel-setting/funnel-setting";
import FunnelSteps from "@/components/funnel-steps/funnel-steps";

interface FunnelIdPageProps {
  params: {
    funnelId: string;
    subaccountId: string;
  };
}

const FunnelIdPage = async ({
  params: { funnelId, subaccountId },
}: FunnelIdPageProps) => {
  const funnelPages = await getFunnel(funnelId);

  if (!funnelPages) return redirect(`/subaccount/${subaccountId}/funnels`);

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${subaccountId}/funnels`}
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
      >
        Back
      </Link>
      <h1 className="text-3xl mb-8">{funnelPages.name}</h1>
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="steps">
          <FunnelSteps
            funnel={funnelPages}
            subaccountId={subaccountId}
            pages={funnelPages.FunnelPages}
            funnelId={funnelId}
          />
        </TabsContent>
        <TabsContent value="settings">
          <FunnelSettings
            subaccountId={subaccountId}
            defaultData={funnelPages}
          />
        </TabsContent>
      </Tabs>
    </BlurPage>
  );
};

export default FunnelIdPage;
