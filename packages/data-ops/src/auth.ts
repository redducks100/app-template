import { neon } from "@neondatabase/serverless";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { customSession, organization } from "better-auth/plugins";
import { NeonDialect } from "kysely-neon";

import { ac, admin, member, owner } from "@app/shared/permissions";

import { getDb } from "./db";
import { hashPassword, verifyPassword } from "./password";
import {
  getFirstMembership,
  getUserLastOrganizationId,
  updateUserLastOrganizationId,
} from "./queries/user";

export interface AuthOptions {
  onOAuthUserCreated?: {
    uploadAvatarToR2: (userId: string, imageUrl: string) => Promise<string | null>;
  };
}

export type auth = ReturnType<typeof createAuth>;

let _auth: ReturnType<typeof createAuth>;

function createAuth(options?: AuthOptions) {
  const isSecure = process.env.APP_URL?.startsWith("https://");
  const authOptions = {
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
            await import("./emails/send-verification-email");
          await sendVerificationEmail({
            user: { ...user, email: newEmail },
            url,
          });
        },
      },
      deleteUser: {
        enabled: true,
        sendDeleteAccountVerification: async ({ user, url, token: _token }) => {
          const { default: sendAccountDeletionEmail } =
            await import("./emails/send-account-deletion-email");
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
      sendResetPassword: async ({ user, url, token: _token }, _request) => {
        const { default: sendForgotPasswordEmail } =
          await import("./emails/send-forgot-password-email");
        await sendForgotPasswordEmail({ user, url });
      },
    },
    emailVerification: {
      autoSignInAfterVerification: true,
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => {
        const verificationUrl = new URL(url);
        const clientCallback = verificationUrl.searchParams.get("callbackURL");
        if (clientCallback) {
          const callbackUrl = new URL(clientCallback, process.env.APP_URL!);
          const appUrl = new URL(process.env.APP_URL!);
          callbackUrl.protocol = appUrl.protocol;
          callbackUrl.host = appUrl.host;
          verificationUrl.searchParams.set("callbackURL", callbackUrl.toString());
        } else {
          verificationUrl.searchParams.set("callbackURL", process.env.APP_URL!);
        }

        const { default: sendVerificationEmail } = await import("./emails/send-verification-email");
        await sendVerificationEmail({ user, url: verificationUrl.toString() });
      },
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 100,
      customRules: {
        "/request-password-reset": { window: 30, max: 1 },
        "/send-verification-email": { window: 30, max: 1 },
        "/change-email": { window: 30, max: 1 },
        "/delete-user": { window: 30, max: 1 },
      },
    },
    advanced: {
      ipAddress: {
        ipAddressHeaders: ["cf-connecting-ip"],
      },
      crossSubDomainCookies: {
        enabled: true,
        domain: process.env.COOKIE_DOMAIN || ".enomisoft.com",
      },
      defaultCookieAttributes: {
        sameSite: isSecure ? "none" : "lax",
        secure: isSecure,
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (
              user.image &&
              !user.image.includes(process.env.ASSETS_URL || "assets.enomisoft.com") &&
              options?.onOAuthUserCreated?.uploadAvatarToR2
            ) {
              try {
                const newUrl = await options.onOAuthUserCreated.uploadAvatarToR2(
                  user.id,
                  user.image,
                );
                if (newUrl) {
                  return { data: { ...user, image: newUrl } };
                }
              } catch {
                // Fall back to original URL on failure
              }
            }
            return { data: user };
          },
        },
      },
      session: {
        create: {
          before: async (session) => {
            let orgId = await getUserLastOrganizationId(session.userId);
            if (!orgId) {
              orgId = await getFirstMembership(session.userId);
              if (orgId) await updateUserLastOrganizationId(session.userId, orgId);
            }
            return { data: { ...session, activeOrganizationId: orgId } };
          },
        },
        update: {
          after: async (session) => {
            if (session.activeOrganizationId) {
              await updateUserLastOrganizationId(
                session.userId,
                session.activeOrganizationId as string,
              );
            }
          },
        },
      },
    },
    plugins: [
      organization({
        ac,
        roles: { owner, admin, member },
        dynamicAccessControl: { enabled: true },
        async sendInvitationEmail(data) {
          const { default: sendInvitationEmail } = await import("./emails/send-invitation-email");
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
    ...authOptions,
    plugins: [
      ...(authOptions.plugins ?? []),
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
      }, authOptions),
    ],
  });
  return result;
}

export function getAuth(options?: AuthOptions) {
  if (!_auth) _auth = createAuth(options);
  return _auth;
}
