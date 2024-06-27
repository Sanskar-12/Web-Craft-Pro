import { getAuthUserDetails } from "@/lib/queries";
import MenuOptions from "./menu-options";

interface SidebarProps {
  id: string;
  type: "agency" | "subaccount";
}

const Sidebar = async ({ id, type }: SidebarProps) => {
  const user = await getAuthUserDetails();
  if (!user) return null;

  if (!user.Agency) return null;

  const details =
    type === "agency"
      ? user?.Agency
      : user?.Agency.SubAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabeledAgency = user.Agency.whiteLabel;
  if (!details) return null;

  let sidebarLogo = user.Agency?.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sidebarLogo =
        user?.Agency.SubAccount.find((subaccount) => subaccount.id)
          ?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  const sidebarOpts =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  );

  return (
    <>
      {/* For Desktop */}
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOpts}
        subAccounts={subaccounts}
        user={user}
      />

      {/* For Mobile */}
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sidebarLogo}
        sidebarOpt={sidebarOpts}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;
