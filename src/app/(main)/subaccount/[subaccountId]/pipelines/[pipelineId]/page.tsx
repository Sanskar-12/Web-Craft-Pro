import { db } from "@/lib/db";
import { getLanesWithTicketsAndTags, getPipeLineDetails } from "@/lib/queries";
import { LaneDetail } from "@/lib/types";
import { redirect } from "next/navigation";

interface PipelineIdPageProps {
  params: {
    subaccountId: string;
    pipelineId: string;
  };
}

const PipelineIdPage = async ({
  params: { subaccountId, pipelineId },
}: PipelineIdPageProps) => {
  const pipelineDetails = await getPipeLineDetails(pipelineId);

  if (!pipelineDetails)
    return redirect(`/subaccount/${subaccountId}/pipelines`);

  const pipelines = await db.pipeline.findMany({
    where: {
      subAccountId: subaccountId,
    },
  });

  const lanes = (await getLanesWithTicketsAndTags(pipelineId)) as LaneDetail[];

  return <div>PipelineIdPage</div>;
};

export default PipelineIdPage;
