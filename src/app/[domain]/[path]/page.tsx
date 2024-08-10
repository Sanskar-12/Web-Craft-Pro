import FunnelEditor from "@/components/funnel-editor/funnel-editor-main";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-providers";
import { notFound } from "next/navigation";

interface PathPageProps {
  params: {
    domain: string;
    path: string;
  };
}

const PathPage = async ({ params: { domain, path } }: PathPageProps) => {
  const domainData = await getDomainContent(domain.slice(0, -1));

  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === path
  );

  if (!pageData || !domainData) return notFound();

  return (
    <EditorProvider
      subaccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData.id}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  );
};

export default PathPage;
