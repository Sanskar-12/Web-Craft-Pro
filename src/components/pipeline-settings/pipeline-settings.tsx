"use client";

import { Pipeline } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { deletePipeline, saveActivityLogsNotification } from "@/lib/queries";
import CreatePipelineForm from "../forms/create-pipeline";

interface PipelineSettingsProps {
  pipelineId: string;
  subaccountId: string;
  pipelines: Pipeline[];
}

const PipelineSettings = ({
  pipelineId,
  subaccountId,
  pipelines,
}: PipelineSettingsProps) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"}>Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="items-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    const response = await deletePipeline(pipelineId);
                    //Challenge: Activity log
                    await saveActivityLogsNotification({
                      agencyId: undefined,
                      description: `Pipeline Deleted | ${response.name}`,
                      subaccountId,
                    });

                    toast({
                      title: "Deleted",
                      description: "Pipeline is deleted",
                    });
                    router.replace(`/subaccount/${subaccountId}/pipelines`);
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Oppse!",
                      description: "Could Delete Pipeline",
                    });
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>

        <CreatePipelineForm
          subAccountId={subaccountId}
          defaultData={pipelines.find((p) => p.id === pipelineId)}
        />
      </div>
    </AlertDialog>
  );
};

export default PipelineSettings;
