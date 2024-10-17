// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { Liveblocks } from "@liveblocks/node";
import { getAuth, auth, currentUser } from "@clerk/nextjs/server";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
});

// POST handler to generate a Liveblocks token
export async function POST(req: NextRequest) {
  //   const { userId } = await req.json(); // Expect userId from request body

  try {
    // Validate user via Clerk
    const authorization = auth();
    const user = await currentUser();

    if (!authorization || !user) {
      return new Response("Unauthorized", { status: 403 });
    }

    const { userId } = getAuth(req) || "";
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { body, status } = await liveblocks.identifyUser(
      {
        userId: userId,
        groupIds: [], // Add appropriate group IDs here
      },
      {
        userInfo: {
          name: user.firstName || "Guest", // Replace with actual user name
          avatar: user.imageUrl, // Replace with actual avatar URL
          color: "Default Color", // Replace with actual color
        },
      }
    );

    if (status === 200) {
      return NextResponse.json(body);
    } else {
      return NextResponse.json({ message: "Failed to generate token" });
    }
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
