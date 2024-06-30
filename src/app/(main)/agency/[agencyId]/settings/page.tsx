import AgencyDetails from "@/components/forms/agency-details"
import UserDetails from "@/components/user-details/user-details"
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs"

interface SettingsPageProps {
  params:{
    agencyId:string
  }
}

const SettingsPage = async ({params:{
  agencyId
}}:SettingsPageProps) => {

  const authUser=await currentUser()
  if(!authUser) return null

  const userData=await db.user.findUnique({
    where:{
      email:authUser.emailAddresses[0].emailAddress
    }
  })

  if(!userData) return null

  const agencyDetails=await db.agency.findUnique({
    where:{
      id:agencyId
    },
    include:{
      SubAccount:true
    }
  })

  if(!agencyDetails) return null

  const subAccounts=agencyDetails.SubAccount

  return (
    <div className="flex lg:flex-row flex-col gap-4">
      <AgencyDetails
        data={agencyDetails}
      />
      <UserDetails
        type="agency"
        id={agencyId}
        subAccounts={subAccounts}
        userData={userData}
      />
    </div>
  )
}

export default SettingsPage