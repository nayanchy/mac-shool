import { auth } from "@clerk/nextjs/server";

export async function getUserRole(): Promise<{
  role?: string;
  userId?: string;
}> {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.meta as { role?: string })?.role;
  return { role, userId: userId ?? "" };
}
