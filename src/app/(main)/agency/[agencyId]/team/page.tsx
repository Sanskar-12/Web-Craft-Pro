import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";

interface TeamPageProps {
  params: {
    agencyId: string;
  };
}

const TeamPage = async ({ params: { agencyId } }: TeamPageProps) => {
  const authUser = await currentUser();

  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<></>}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    />
  );
};

export default TeamPage;
