import { betterAuth, type BetterAuthOptions } from "better-auth";
import { NeonDialect } from "kysely-neon";
import { neon } from "@neondatabase/serverless";
import { getDb } from "./db.js";
import { customSession, organization } from "better-auth/plugins";
import { ac, owner, admin, member } from "@app/shared/permissions";
import { hashPassword, verifyPassword } from "./password.js";

export type auth = ReturnType<typeof createAuth>;

let _auth: ReturnType<typeof createAuth>;

function createAuth() {
  const isSecure = process.env.APP_URL?.startsWith("https://");
  const options = {
    baseURL: process.env.BETTER_AUTH_URL || process.env.APP_URL,
    trustedOrigins: [process.env.APP_URL!],
    database: {
      dialect: new NeonDialect({
        neon: neon(process.env.DATABASE_URL!),
      }),
      type: "postgres" as const,
    },
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
        const membership = await getDb()
          .selectFrom("member")
          .select("id")
          .where("userId", "=", user.id)
          .executeTakeFirst();

        const dbUser = await getDb()
          .selectFrom("user")
          .select(["id", "locale"])
          .where("id", "=", user.id)
          .executeTakeFirst();

        return {
          user: {
            ...user,
            hasMembership: !!membership,
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
