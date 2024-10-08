import FunnelEditor from "@/components/funnel-editor/funnel-editor-main";
import { db } from "@/lib/db";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-providers";
import { notFound } from "next/navigation";

interface HostedFunnelPageProps {
  params: {
    domain: string;
  };
}

const HostedFunnelPage = async ({
  params: { domain },
}: HostedFunnelPageProps) => {
  const domainData = await getDomainContent(domain.slice(0, -1));

  if (!domainData) return notFound();

  const pageData = domainData.FunnelPages.find((page) => !page.pathName);

  if (!pageData) return notFound();

  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  });

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

export default HostedFunnelPage;
