"use client";
import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";
import { RoomProvider, ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react";
import Room from "@/components/Room";
import { useAuth } from "@clerk/nextjs";

export default function Index() {
  const roomId = "liveblocks-tutorial-uGsBXuwY-c0_1ouo_TGBa";
  // const { userId, isSignedIn } = useAuth(); // Assume this provides `user` and `logout` functions
  // const [isRoomActive, setIsRoomActive] = useState(false);

  // useEffect(() => {
  //   if (!isSignedIn) {
  //     setIsRoomActive(false);
  //   }
  // }, [isSignedIn]);

  // If logged in, go to dashboard
  // if (session) {
  //   redirect(DASHBOARD_URL);
  // }

  return (
    <MarketingLayout>
      <Container className={styles.section}>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroTitle}>Speaking a new language</h1>
          <p className={styles.heroLead}>Pronounciation Face-Off</p>
          <LiveblocksProvider
            // publicApiKey={`${process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}`}
            authEndpoint="/api/liveblocks-auth"
          >
            <RoomProvider
              id={roomId}
              initialPresence={{
                name: "",
                isReady: false,
                color: "",
                avatarUrl: null,
                score: null,
              }}
              initialStorage={{
                startTime: null,
              }}
            >
              <ClientSideSuspense fallback={<div>Please signin to join...</div>}>
                <Room />
              </ClientSideSuspense>
            </RoomProvider>
          </LiveblocksProvider>
        </div>
      </Container>
    </MarketingLayout>
  );
}
