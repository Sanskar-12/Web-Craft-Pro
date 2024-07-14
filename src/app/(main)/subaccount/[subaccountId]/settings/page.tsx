import BlurPage from "@/components/blur-page/blur-page";
import SubAccountDetails from "@/components/forms/subaccount-details";
import UserDetails from "@/components/user-details/user-details";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";

interface SubaccountSettingsPageProps {
  params: {
    subaccountId: string;
  };
}

const SubaccountSettingsPage = async ({
  params: { subaccountId },
}: SubaccountSettingsPageProps) => {
  const authUser = await currentUser();
  if (!authUser) return;

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  });
  if (!userDetails) return;

  const subAccountDetails = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  });
  if (!subAccountDetails) return;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: subAccountDetails?.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });
  if (!agencyDetails) return;

  const subAccounts = agencyDetails.SubAccount;

  return (
    <BlurPage>
      <div className="flex lg:!flex-row flex-col gap-4">
        <SubAccountDetails
          agencyDetails={agencyDetails}
          details={subAccountDetails}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetails
          type="subaccount"
          id={subaccountId}
          subAccounts={subAccounts}
          userData={userDetails}
        />
      </div>
    </BlurPage>
  );
};

export default SubaccountSettingsPage;
