"use client";

import { useModal } from "@/providers/modal-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lane } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import {
  getPipelineDetails,
  saveActivityLogsNotification,
  upsertLane,
} from "@/lib/queries";

interface LaneFormProps {
  defaultData?: Lane;
  pipelineId: string;
}

const LaneFormSchema = z.object({
  name: z.string().min(1),
});

const LaneForm = ({ defaultData, pipelineId }: LaneFormProps) => {
  const { setClose } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof LaneFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(LaneFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
    if (!pipelineId) return;
    try {
      const response = await upsertLane({
        ...values,
        id: defaultData?.id,
        pipelineId,
        order: defaultData?.order,
      });

      const d = await getPipelineDetails(pipelineId);
      if (!d) return;

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a lane | ${response?.name}`,
        subaccountId: d.subAccountId,
      });

      toast({
        title: "Success",
        description: "Saved pipeline details",
      });

      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save pipeline details",
      });
    }

    setClose();
  };

  return <div>LaneForm</div>;
};

export default LaneForm;
