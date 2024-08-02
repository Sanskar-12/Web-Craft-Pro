import MediaComponent from "@/components/media/MediaComponent";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/lib/types";
import { useEffect, useState } from "react";

interface MediaBucketTabProps {
  subaccountId: string;
}

const MediaBucketTab = ({ subaccountId }: MediaBucketTabProps) => {
  const [data, setData] = useState<GetMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(subaccountId);
      setData(response);
    };
    fetchData();
  }, [subaccountId]);

  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponent data={data} subaccountId={subaccountId} />
    </div>
  );
};

export default MediaBucketTab;
