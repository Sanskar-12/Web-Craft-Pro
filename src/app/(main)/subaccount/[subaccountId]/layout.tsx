import InfoBar from "@/components/info-bar/info-bar";
import Sidebar from "@/components/sidebar/sidebar";
import Unauthorized from "@/components/unauthorised/unauthorised";
import {
  getAuthUserDetails,
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface SubAccountIdLayoutProps {
  children: ReactNode;
  params: {
    subaccountId: string;
  };
}

const SubAccountIdLayout = async ({
  children,
  params: { subaccountId },
}: SubAccountIdLayoutProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  if (!agencyId) return <Unauthorized />;

  const user = await currentUser();
  if (!user) return redirect("/");

  let notifications: any = [];

  if (!user.privateMetadata.role) {
    return <Unauthorized />;
  } else {
    const allPermission = await getAuthUserDetails();
    const hasPermission = allPermission?.Permissions.find(
      (permission) =>
        permission.access && permission.subAccountId === subaccountId
    );

    if (!hasPermission) return <Unauthorized />;

    const allNotifications = await getNotificationAndUser(agencyId);

    if (
      user.privateMetadata.role === "AGENCY_ADMIN" ||
      user.privateMetadata.role === "AGENCY_OWNER"
    ) {
      notifications = allNotifications;
    } else {
      const filteredNoti = allNotifications?.filter(
        (item) => item.subAccountId === subaccountId
      );
      if (filteredNoti) notifications = filteredNoti;
    }
  }

  return  <div className="h-screen overflow-hidden">
  <Sidebar
    id={subaccountId}
    type="subaccount"
  />

  <div className="md:pl-[300px]">
    <InfoBar
      notifications={notifications}
      role={user.privateMetadata.role as Role}
      subAccountId={subaccountId as string}
    />
    <div className="relative">{children}</div>
  </div>
</div>
};

export default SubAccountIdLayout;
