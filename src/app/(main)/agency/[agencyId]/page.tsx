import React from "react";

const AgencyPage = ({ params }: { params: { agencyId: string } }) => {
  return (
    <div>
      {params.agencyId}
      Agency
    </div>
  );
};

export default AgencyPage;
