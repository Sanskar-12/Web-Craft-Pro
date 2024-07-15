"use client";

import { useModal } from "@/providers/modal-provider";
import CustomModal from "../custommodal/custom-modal";
import { Button } from "../ui/button";
import ContactUserForm from "../forms/contact-user";

interface CreateContactButtonProps {
  subaccountId: string;
}

const CreateContactButton = ({ subaccountId }: CreateContactButtonProps) => {
  const { setOpen } = useModal();

  const handleCreateContact = () => {
    setOpen(
      <CustomModal
        title="Create Or Update Contact information"
        subheading="Contacts are like customers."
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>
    );
  };

  return <Button onClick={handleCreateContact}>Create Contact</Button>;
};

export default CreateContactButton;
