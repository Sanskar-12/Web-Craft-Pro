import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
      <ClerkProvider appearance={{ baseTheme: dark }}>
            {children}
      </ClerkProvider>
  );
};

export default layout;
