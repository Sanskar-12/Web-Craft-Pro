"use client";

import { PricesList } from "@/lib/types";
import { useModal } from "@/providers/modal-provider";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import CustomModal from "../custommodal/custom-modal";
import SubscriptionFormWrapper from "../forms/subscription-form/subscription-form-wrapper";

interface SubscriptionHelperProps {
  prices: PricesList["data"];
  customerId: string;
  planExists: boolean;
}

const SubscriptionHelper = ({
  prices,
  customerId,
  planExists,
}: SubscriptionHelperProps) => {
  const { setOpen } = useModal();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  useEffect(() => {
    if (plan) {
      setOpen(
        <CustomModal
          title="Upgrade Plan!"
          subheading="Get started today to get access to premium features"
        >
          <SubscriptionFormWrapper
            planExists={planExists}
            customerId={customerId}
          />
        </CustomModal>,
        async () => ({
          plans: {
            defaultPriceId: plan ? plan : "",
            plans: prices,
          },
        })
      );
    }
  }, [plan]);

  return <div>SubscriptionHelper</div>;
};

export default SubscriptionHelper;
