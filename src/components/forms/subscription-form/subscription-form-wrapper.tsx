"use client";

import { toast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";
import { Plan } from "@prisma/client";
import { StripeElementsOptions } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface SubscriptionFormWrapperProps {
  customerId: string;
  planExists: boolean;
}

const SubscriptionFormWrapper = ({
  customerId,
  planExists,
}: SubscriptionFormWrapperProps) => {
  const { data, setClose } = useModal();
  const router = useRouter();
  const [selectedPriceId, setSelectedPriceId] = useState<Plan | "">(
    data?.plans?.defaultPriceId || ""
  );
  const [subscription, setSubscription] = useState<{
    subscriptionId: string;
    clientSecret: string;
  }>({
    subscriptionId: "",
    clientSecret: "",
  });

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: subscription?.clientSecret,
      appearance: {
        theme: "flat",
      },
    }),
    [subscription]
  );

  useEffect(() => {
    if (!selectedPriceId) return;

    const createSecret = async () => {
      const { data } = await axios.post(
        "/api/stripe/create-subscription",
        {
          customerId,
          priceId: selectedPriceId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSubscription({
        clientSecret:data.clientSecret,
        subscriptionId:data.subscriptionId
      })
      if (planExists) {
        toast({
          title: 'Success',
          description: 'Your plan has been successfully upgraded!',
        })
        setClose()
        router.refresh()
      }
    };
    createSecret();
  }, [data,selectedPriceId,customerId]);

  return <div>SubscriptionFormWrapper</div>;
};

export default SubscriptionFormWrapper;
