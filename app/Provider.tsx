'use client'

import Loader from "@/components/Loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import {
  LiveblocksProvider,
  ClientSideSuspense
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();

  const currentEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users || []; // ✅ fallback
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        if (!currentEmail) return []; // ✅ safety check

        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: currentEmail,
          text,
        });

        return roomUsers || []; // ✅ fallback
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
