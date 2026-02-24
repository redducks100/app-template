import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.js";
import { customSession, organization } from "better-auth/plugins";
import { ac, owner, admin, member } from "@app/shared/permissions";
import sendForgotPasswordEmail from "../emails/send-forgot-password-email.js";
import sendVerificationEmail from "../emails/send-verification-email.js";
import sendAccountDeletionEmail from "../emails/send-account-deletion-email.js";
import sendInvitationEmail from "../emails/send-invitation-email.js";
import { member as memberTable, user as userTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

const options = {
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendVerificationEmail({
          user: { ...user, email: newEmail },
          url,
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url, token }) => {
        await sendAccountDeletionEmail({
          user,
          url,
        });
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendForgotPasswordEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ user, url });
    },
  },
  plugins: [
    organization({
      ac,
      roles: { owner, admin, member },
      dynamicAccessControl: { enabled: true },
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
        await sendInvitationEmail({
          email: data.email,
          inviterName: data.inviter.user.name,
          organizationName: data.organization.name,
          role: data.role,
          inviteUrl: inviteLink,
        });
      },
    }),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...options,
  plugins: [
    ...(options.plugins ?? []),
    customSession(async ({ user, session }) => {
      const memberships = await db.query.member.findFirst({
        where: eq(memberTable.userId, user.id),
        columns: { id: true },
      });

      const dbUser = await db.query.user.findFirst({
        where: eq(userTable.id, user.id),
        columns: { id: true, locale: true },
      });

      return {
        user: {
          ...user,
          hasMembership: !!memberships,
          locale: dbUser?.locale,
        },
        session,
      };
    }, options),
  ],
});
