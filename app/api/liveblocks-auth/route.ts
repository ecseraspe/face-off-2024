// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { Liveblocks } from "@liveblocks/node";
import { getAuth, auth, currentUser } from "@clerk/nextjs/server";
import { getRandomColor } from "@/utils/colorUtils";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
});

// POST handler to generate a Liveblocks token
export async function POST(request: Request) {
  //   const { userId } = await req.json(); // Expect userId from request body

  try {
    // Validate user via Clerk
    const authorization = auth();
    const user = await currentUser();
    const newColor = getRandomColor();
    if (!authorization || !user) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { room } = await request.json();
    const userInfo = {
      name: user.firstName || user.primaryEmailAddress?.emailAddress,
      picture: user.imageUrl,
      avatar: user.imageUrl,
      color: newColor,
    };

    const session = liveblocks.prepareSession(user.id, { userInfo });

    if (room) {
      session.allow(room, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();

    return new Response(body, { status });
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
