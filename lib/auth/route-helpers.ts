import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../db";
import { member } from "@/drizzle/auth";
import { eq } from "drizzle-orm";

export const verifySession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return session;
};

export const protectRoute = cache(
  async (userId: string, activeOrganizationId: string | undefined | null) => {
    const userMember = await db.query.member.findFirst({
      where: eq(member.userId, userId),
    });

    if (!userMember) {
      redirect("/create-org");
    } else if (userMember && !activeOrganizationId) {
      redirect("/select-org");
    }
  },
);
