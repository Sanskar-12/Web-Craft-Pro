import Unauthorized from "@/components/unauthorised/unauthorised";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { redirect } from "next/navigation";

interface SubAccountPageProps {
  searchParams: {
    state: string;
    code: string;
  };
}

const SubAccountPage = async ({
  searchParams: { state, code },
}: SubAccountPageProps) => {
  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await getAuthUserDetails();
  if (!user) return;


  const getFirstSubaccountWithAccess = user.Permissions.find(
    (permission) => permission.access === true
  );


  if (state) {
    const statePath = state.split("___")[0];
    const stateSubaccountId = state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${code}`
    );
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`);
  }

  return <Unauthorized/>
};

export default SubAccountPage;
