// liveblocksClient.ts
import { createClient } from "@liveblocks/client";

export const liveblocksClient = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!,
});
