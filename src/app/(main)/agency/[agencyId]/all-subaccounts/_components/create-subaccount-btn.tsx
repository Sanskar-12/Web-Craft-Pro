"use client";

import CustomModal from "@/components/custommodal/custom-modal";
import SubAccountDetails from "@/components/forms/subaccount-details";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Agency, AgencySidebarOption, SubAccount, User } from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface CreateSubAccountButtonProps {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption[];
            })
        )
      | null;
  };
  id: string;
  className: string;
}

const CreateSubAccountButton = ({
  user,
  id,
  className,
}: CreateSubAccountButtonProps) => {
  const { setOpen } = useModal();
  const agencyDetails = user.Agency;

  if (!agencyDetails) return;
  return (
    <Button
      className={twMerge("w-full flex gap-4", className)}
      onClick={() =>
        setOpen(
          <CustomModal
            title="Create a Subaccount"
            subheading="You can switch between"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userId={user.id}
              userName={user.name}
            />
          </CustomModal>
        )
      }
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  );
};

export default CreateSubAccountButton;
