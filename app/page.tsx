"use client";
import { ComponentProps, ReactNode, useEffect, useState } from "react";
import { MarketingLayout } from "@/layouts/Marketing";
import { Container } from "@/primitives/Container";
import styles from "./page.module.css";
import {
  RoomProvider,
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react";
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
          <h1 className={styles.heroTitle}>Hackathon 2024</h1>
          <p className={styles.heroLead}>Speech Recognition FaceOff</p>
          <LiveblocksProvider
            // publicApiKey={`${process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY}`}
            authEndpoint="/api/liveblocks-auth"
          >
            <RoomProvider id={roomId} initialPresence={{}} initialStorage={{}}>
              <ClientSideSuspense fallback={<div>Loading…</div>}>
                <Room />
              </ClientSideSuspense>
            </RoomProvider>
          </LiveblocksProvider>
        </div>
      </Container>
    </MarketingLayout>
  );
}
