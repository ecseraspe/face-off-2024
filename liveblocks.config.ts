import { LiveMap, LiveObject } from "@liveblocks/client";
import { Document, User } from "./types";
import { createClient } from "@liveblocks/client";
import { createLiveblocksContext, createRoomContext } from "@liveblocks/react";

// declare global {
//   interface Liveblocks {
//     // Each user's Presence, for useMyPresence, useOthers, etc.
//     Presence: {
//       name: string; // User's display name
//       isOnline: boolean; // Online status
//       score?: number; // Optional field to store user score
//       avatarUrl?: string; // Optional avatar image URL
//     };
//     // The Storage tree for the room, for useMutation, useStorage, etc.
//     Storage: {
//       // notes: Notes;
//     };
//     // Custom user info set when authenticating with a secret key
//     UserMeta: {
//       id: string;
//       info: Pick<User, "name" | "avatar" | "color">;
//     };
//     // Custom events, for useBroadcastEvent, useEventListener
//     RoomEvent: {
//       // type: "SHARE_DIALOG_UPDATE";
//     };
//     // Custom metadata set on threads, for useThreads, useCreateThread, etc.
//     // ThreadMetadata: {
//     //   highlightId: string;
//     // };
//     // ActivitiesData: {
//     //   $addedToDocument: {
//     //     documentId: Document["id"];
//     //   };
//     // };
//   }
// }

const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks-auth",
});

export type Presence = {
  name: string; // User's display name
  isReady: boolean; // Online status
  score?: number; // Optional field to store user score
  avatarUrl?: string; // Optional avatar image URL
  color?: string;
};

// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    picture?: string;
  };
};

export type LobbyRoom = {
  id: string;
  players: Presence[];
  status: "waiting" | "in-progress";
};

type Storage = {
  startTime: number | null;
  currentWord: string | null;
  selectedHost: number | null;
};
type RoomEvent = {};
type ThreadMetadata = {};

export const {
  suspense: {
    RoomProvider,
    useMyPresence,
    // Other hooks
    // ...
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);

export const {
  suspense: {
    LiveblocksProvider,
    // useMarkInboxNotificationAsRead,
    // useMarkAllInboxNotificationsAsRead,
    // useInboxNotifications,
    // useUnreadInboxNotificationsCount,

    // These hooks can be exported from either context
    // useUser,
    // useRoomInfo,
  },
} = createLiveblocksContext<UserMeta, ThreadMetadata>(client);
