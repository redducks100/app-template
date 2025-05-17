"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const signUp = async () => {
  await auth.api.signUpEmail({
    body: {
      email: "simone@test.com",
      password: "password123",
      name: "Simone Andronache",
    },
  });

  redirect("/sign-in");
};
