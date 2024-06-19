import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
      <ClerkProvider appearance={{ baseTheme: dark }}>
        <main className="h-full">
            {children}
        </main>
      </ClerkProvider>
  );
};

export default layout;
