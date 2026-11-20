import "server-only";

import { headers } from "next/headers";
import { auth } from "./lib/auth";

// Get Current User Session
export const ServerSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
};