import Sidebar from "@/components/sidebar/sidebar";
import Unauthorized from "@/components/unauthorised/unauthorised";
import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: {
    agencyId: string;
  };
}

const LayoutPage = async ({ children, params }: LayoutProps) => {
  const agencyId = await verifyAndAcceptInvitation();
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/");
  }
  if (
    user.privateMetadata.role !== 'AGENCY_OWNER' &&
    user.privateMetadata.role !== 'AGENCY_ADMIN'
  )
    return <Unauthorized />


    let allNotification:any=[]

    const notifications=await getNotificationAndUser(agencyId)
    if(notifications) allNotification=notifications


  return <div className="h-screen overflow-hidden">
    <Sidebar
    id={params.agencyId}
    type="agency"
    />
    <div className="md:pl-[300px]">
    </div>
  </div>;
};

export default LayoutPage;
