import {liveblocks} from "@/lib/liveblocks"
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function POST(request: Request) {
    const clerkUser=await currentUser();
    if (!clerkUser) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}

    const {id,firstName,lastName,emailAddresses,imageUrl}=clerkUser
    const user={
        id,
        info:{
            id,
            name:`${firstName} ${lastName}`,
            email:emailAddresses[0].emailAddress,
            avatar:imageUrl,
            color:getUserColor(id)
        }
    }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds:[]
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}