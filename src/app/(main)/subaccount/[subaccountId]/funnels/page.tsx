import BlurPage from "@/components/blur-page/blur-page";
import { getFunnels } from "@/lib/queries";
import FunnelsDataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import FunnelForm from "@/components/forms/funnel-form";

interface FunnelPageProps {
  params: {
    subaccountId: string;
  };
}

const FunnelPage = async ({ params: { subaccountId } }: FunnelPageProps) => {
  const funnels = await getFunnels(subaccountId);

  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={<FunnelForm subaccountId={subaccountId}></FunnelForm>}
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};

export default FunnelPage;
