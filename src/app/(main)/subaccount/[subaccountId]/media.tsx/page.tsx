import BlurPage from "@/components/blur-page/blur-page"
import MediaComponent from "@/components/media/MediaComponent"
import { getMedia } from "@/lib/queries"

interface MediaPageProps {
    params:{
        subaccountId:string
    }
}


const MediaPage = async({params:{subaccountId}}:MediaPageProps) => {

    const data=await getMedia(subaccountId)

  return (
    <BlurPage>
        <MediaComponent
            data={data}
            subaccountId={subaccountId}
        />
    </BlurPage>
  )
}

export default MediaPage