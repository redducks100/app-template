import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db.js";
import { customSession, organization } from "better-auth/plugins";
import { ac, owner, admin, member } from "@app/shared/permissions";
import { hashPassword, verifyPassword } from "./password.js";
import { member as memberTable, user as userTable } from "../db/schema.js";
import { eq } from "drizzle-orm";

export type auth = ReturnType<typeof createAuth>;

let _auth: ReturnType<typeof createAuth>;

function createAuth() {
  const isSecure = process.env.APP_URL?.startsWith("https://");
  const options = {
    baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL,
    trustedOrigins: [process.env.APP_URL!],
    database: drizzleAdapter(getDb(), {
      provider: "pg",
    }),
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async ({ user, url, newEmail }) => {
          const { default: sendVerificationEmail } =
            await import("../emails/send-verification-email.js");
          await sendVerificationEmail({
            user: { ...user, email: newEmail },
            url,
          });
        },
      },
      deleteUser: {
        enabled: true,
        sendDeleteAccountVerification: async ({ user, url, token }) => {
          const { default: sendAccountDeletionEmail } =
            await import("../emails/send-account-deletion-email.js");
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
      password: { hash: hashPassword, verify: verifyPassword },
      sendResetPassword: async ({ user, url, token }, request) => {
        const { default: sendForgotPasswordEmail } =
          await import("../emails/send-forgot-password-email.js");
        await sendForgotPasswordEmail({ user, url });
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        const { default: sendVerificationEmail } =
          await import("../emails/send-verification-email.js");
        await sendVerificationEmail({ user, url });
      },
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: process.env.COOKIE_DOMAIN || ".enomisoft.com",
      },
      defaultCookieAttributes: {
        sameSite: isSecure ? "none" : "lax",
        secure: isSecure,
      },
    },
    plugins: [
      organization({
        ac,
        roles: { owner, admin, member },
        dynamicAccessControl: { enabled: true },
        async sendInvitationEmail(data) {
          const { default: sendInvitationEmail } =
            await import("../emails/send-invitation-email.js");
          const inviteLink = `${process.env.APP_URL}/accept-invitation/${data.id}`;
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

  const result = betterAuth({
    ...options,
    plugins: [
      ...(options.plugins ?? []),
      customSession(async ({ user, session }) => {
        const memberships = await getDb().query.member.findFirst({
          where: eq(memberTable.userId, user.id),
          columns: { id: true },
        });

        const dbUser = await getDb().query.user.findFirst({
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
  return result;
}

export function getAuth() {
  if (!_auth) _auth = createAuth();
  return _auth;
}
