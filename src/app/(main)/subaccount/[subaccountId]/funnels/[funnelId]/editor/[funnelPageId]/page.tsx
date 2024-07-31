import { db } from "@/lib/db"
import EditorProvider from "@/providers/editor/editor-providers"
import { redirect } from "next/navigation"

interface EditorFunnelPageId {
  params:{
    subaccountId:string,
    funnelId:string,
    funnelPageId:string
  }
}

const EditorFunnelPageId =async ({params:{
  subaccountId,
  funnelId,
  funnelPageId
}}:EditorFunnelPageId) => {

  const funnelPageDetails=await db.funnelPage.findFirst({
    where:{
      id:funnelPageId
    }
  })

  if (!funnelPageDetails) {
    return redirect(
      `/subaccount/${subaccountId}/funnels/${funnelId}`
    )
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={subaccountId}
        funnelId={funnelId}
        pageDetails={funnelPageDetails}
      > 
        
      </EditorProvider>
    </div>
  )
}

export default EditorFunnelPageId