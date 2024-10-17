"use client";
import { useAuth } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react";
import { useIsInsideRoom, useOthers } from "@liveblocks/react/suspense";

import { useEffect, useState } from "react";

export default function Room() {
  const [token, setToken] = useState<string | null>(null);
  const others = useOthers();
  const roomId = "liveblocks-tutorial-uGsBXuwY-c0_1ouo_TGBa";

  useEffect(() => {
    async function fetchToken() {
      const response = await fetch("/api/liveblocks-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }),
      });

      if (response.ok) {
        const { token } = await response.json();
        console.log("Token:", token);
        setToken(token);
        // Use this token to join the room
      } else {
        console.error("Failed to authorize:", await response.json());
      }
    }
    fetchToken();
  }, []);

  if (!token) return <div>Please signin to join.</div>;

  return <div>There are {others.length} other user(s) online</div>;
}
