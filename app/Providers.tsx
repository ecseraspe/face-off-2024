import { LiveblocksProvider } from "@liveblocks/react/suspense";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import Router from "next/router";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { DOCUMENT_URL } from "@/constants";
import { authorizeLiveblocks, getSpecificDocuments } from "@/lib/actions";
import { getUsers } from "@/lib/database";

export function Providers({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    // <SessionProvider session={session}>
    // <LiveblocksProvider
    //   publicApiKey={`${process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}`}
    //   // authEndpoint={async (room: any) => {
    //   //   const response = await fetch("/api/liveblocks-auth", {
    //   //     method: "POST",
    //   //     headers: {
    //   //       Authentication: "",
    //   //       "Content-Type": "application/json",
    //   //     },
    //   //     // Don't forget to pass `room` down. Note that it
    //   //     // can be undefined when using Notifications.
    //   //     body: JSON.stringify({ room }),
    //   //   });
    //   //   return await response.json();
    //   // }}
    // >
    <div>{children}</div>
    // </LiveblocksProvider>
    // </SessionProvider>
  );
}
