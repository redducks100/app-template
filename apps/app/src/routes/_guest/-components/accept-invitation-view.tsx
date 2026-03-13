import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { Building2, Loader2, LockIcon, MailCheckIcon, MailIcon, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OATH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/constants";
import { sessionOptions } from "@/lib/queries/auth";
import { invitationGetOptions } from "@/lib/queries/invitations";
import { signUpSchema } from "@app/shared/schemas/sign-up-schema";
import { Badge } from "@app/ui/components/badge";
import { Button, buttonVariants } from "@app/ui/components/button";
import { Field, FieldDescription, FieldGroup } from "@app/ui/components/field";
import { useAppForm } from "@app/ui/components/form/hooks";
import { Separator } from "@app/ui/components/separator";

type AcceptInvitationViewProps = {
  invitationId: string;
};

export const AcceptInvitationView = ({ invitationId }: AcceptInvitationViewProps) => {
  const { t } = useTranslation("invitations");
  const { data: session } = useQuery(sessionOptions());

  const { data: invitation } = useSuspenseQuery(invitationGetOptions(invitationId));

  const isExpired = new Date(invitation.expiresAt) < new Date();
  const isInvalid =
    invitation.status === "canceled" ||
    invitation.status === "rejected" ||
    invitation.status === "accepted";

  if (isExpired || isInvalid) {
    return (
      <div className="animate-in-stagger">
        <div className="mb-8">
          <h1 className="text-2xl font-medium tracking-tight">{t("unavailableTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isExpired ? t("expired") : t("noLongerValid")}
          </p>
        </div>

        <Link to="/sign-in" className={buttonVariants({ className: "w-full" })}>
          {t("goToSignIn")}
        </Link>
      </div>
    );
  }

  const roleName = invitation.role
    ? invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)
    : t("member");

  return (
    <div className="animate-in-stagger">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight">{t("youveBeenInvited")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("invitedBy", { name: invitation.inviter.name })}{" "}
          <span className="font-medium text-foreground">{invitation.organization.name}</span>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between border border-border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 text-muted-foreground" />
            <span className="font-medium">{invitation.organization.name}</span>
          </div>
          <Badge variant="secondary">{roleName}</Badge>
        </div>

        <div className="flex items-center gap-3 py-1">
          <Separator className="flex-1" />
          <Separator className="flex-1" />
        </div>

        {session && session.user.emailVerified ? (
          <AuthenticatedActions invitationId={invitationId} />
        ) : session && !session.user.emailVerified ? (
          <UnverifiedActions invitationId={invitationId} email={session.user.email} />
        ) : (
          <UnauthenticatedActions invitationId={invitationId} invitationEmail={invitation.email} />
        )}
      </div>
    </div>
  );
};

function AuthenticatedActions({ invitationId }: { invitationId: string }) {
  const { t } = useTranslation("invitations");
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    authClient.organization.acceptInvitation(
      { invitationId },
      {
        onSuccess: async () => {
          if (cancelled) return;
          await queryClient.fetchQuery({ ...sessionOptions(), staleTime: 0 });
          await router.invalidate();
          toast.success(t("accepted"));
          navigate({ to: "/" });
        },
        onError: ({ error }) => {
          if (cancelled) return;
          setError(error.message || t("acceptError"));
        },
      },
    );
    return () => {
      cancelled = true;
    };
  }, [invitationId]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <p className="text-sm text-destructive">{error}</p>
        <Button className="w-full" onClick={() => navigate({ to: "/" })}>
          {t("goToDashboard")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function UnverifiedActions({ invitationId, email }: { invitationId: string; email: string }) {
  const { t } = useTranslation("invitations");
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await authClient.sendVerificationEmail(
      {
        email,
        callbackURL: new URL(`/accept-invitation/${invitationId}`, window.location.origin).href,
      },
      {
        onSuccess: () => {
          toast.success(t("verificationSent"));
          setResending(false);
        },
        onError: ({ error }) => {
          toast.error(error.message || t("verificationError"));
          setResending(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <MailCheckIcon className="size-10 text-muted-foreground" />
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium">{t("verifyEmail")}</p>
        <p className="text-sm text-muted-foreground">{t("verifyEmailDescription")}</p>
      </div>
      <Button variant="outline" className="w-full" onClick={handleResend} disabled={resending}>
        {resending ? <Loader2 className="size-4 animate-spin" /> : t("resendVerification")}
      </Button>
      <button
        type="button"
        className="text-sm text-muted-foreground underline hover:text-foreground"
        onClick={() => authClient.signOut()}
      >
        {t("signOut")}
      </button>
    </div>
  );
}

function UnauthenticatedActions({
  invitationId,
  invitationEmail,
}: {
  invitationId: string;
  invitationEmail: string;
}) {
  const { t } = useTranslation("invitations");
  const { t: tCommon } = useTranslation("common");
  const { t: tAuth } = useTranslation("auth");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: invitationEmail,
      password: "",
      confirmPassword: "",
    },
    validators: { onSubmit: signUpSchema },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: new URL(`/accept-invitation/${invitationId}`, window.location.origin).href,
        },
        {
          onSuccess: () => {
            toast.success(t("accountCreated"));
          },
          onError: ({ error }) => {
            if (error.code === "USER_ALREADY_EXISTS") {
              toast.error(t("userExists"));
            } else {
              toast.error(error.message || tAuth("sign_up.error"));
            }
          },
        },
      );
    },
  });

  const callbackURL = new URL(`/accept-invitation/${invitationId}`, window.location.origin).href;

  const onProviderSubmit = (provider: SupportedOAuthProvider) => {
    setLoading(true);
    authClient.signIn.social(
      { provider, callbackURL },
      {
        onSuccess: () => {
          navigate({ to: callbackURL });
        },
        onError: ({ error }) => {
          setLoading(false);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <>
      <p className="text-sm text-muted-foreground text-center">{t("createAccountDescription")}</p>

      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_OATH_PROVIDER_DETAILS[provider].Icon;
        return (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onProviderSubmit(provider)}
            className="w-full h-10"
            key={provider}
          >
            <Icon />
            {tCommon("continueWith", {
              provider: SUPPORTED_OATH_PROVIDER_DETAILS[provider].name,
            })}
          </Button>
        );
      })}

      <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase font-medium">
          {tCommon("or")}
        </span>
        <Separator className="flex-1" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label={tAuth("sign_up.name")}
                placeholder={tAuth("sign_up.namePlaceholder")}
                LeftIcon={UserIcon}
              />
            )}
          </form.AppField>
          <form.AppField name="email">
            {(field) => (
              <field.Input
                label={tAuth("sign_up.email")}
                placeholder={tAuth("sign_up.emailPlaceholder")}
                LeftIcon={MailIcon}
                disabled
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.Input
                label={tAuth("sign_up.password")}
                type="password"
                description={tAuth("sign_up.passwordDescription")}
                LeftIcon={LockIcon}
              />
            )}
          </form.AppField>
          <form.AppField name="confirmPassword">
            {(field) => (
              <field.Input
                label={tAuth("sign_up.confirmPassword")}
                type="password"
                description={tAuth("sign_up.confirmPasswordDescription")}
                LeftIcon={LockIcon}
              />
            )}
          </form.AppField>
          <Field>
            <form.AppForm>
              <form.SubmitButton label={t("signUpAccept")} />
            </form.AppForm>
            <FieldDescription className="px-6 text-center">
              {t("alreadyHaveAccount")}
              <Link to={"/sign-in"} search={{ callbackURL: callbackURL }}>
                {tAuth("sign_up.signIn")}
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </>
  );
}
