import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  LockIcon,
  MailIcon,
  UserIcon,
  Loader2,
  MailCheckIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { signUpSchema } from "@app/shared/schemas/sign-up-schema";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import {
  SUPPORTED_OATH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/constants";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { invitationGetOptions } from "@/lib/query-options";

type AcceptInvitationViewProps = {
  invitationId: string;
};

export const AcceptInvitationView = ({
  invitationId,
}: AcceptInvitationViewProps) => {
  const { t } = useTranslation("invitations");
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const { data: invitation } = useSuspenseQuery(
    invitationGetOptions(invitationId),
  );

  const isExpired = invitation.expiresAt < new Date();
  const isInvalid =
    invitation.status === "canceled" ||
    invitation.status === "rejected" ||
    invitation.status === "accepted";

  if (isExpired || isInvalid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("unavailableTitle")}
          </CardTitle>
          <CardDescription>
            {isExpired ? t("expired") : t("noLongerValid")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={() => navigate({ to: "/sign-in" })}
          >
            {t("goToSignIn")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const roleName = invitation.role
    ? invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)
    : t("member");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {t("youveBeenInvited")}
        </CardTitle>
        <CardDescription>
          {t("invitedBy", { name: invitation.inviter.name })}{" "}
          <span className="font-medium text-foreground">
            {invitation.organization.name}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">{t("organization")}</p>
            <p className="font-medium">{invitation.organization.name}</p>
          </div>
          <Badge variant="secondary">{roleName}</Badge>
        </div>

        <Separator />

        {session && session.user.emailVerified ? (
          <AuthenticatedActions invitationId={invitationId} />
        ) : session && !session.user.emailVerified ? (
          <UnverifiedActions
            invitationId={invitationId}
            email={session.user.email}
          />
        ) : (
          <UnauthenticatedActions
            invitationId={invitationId}
            invitationEmail={invitation.email}
          />
        )}
      </CardContent>
    </Card>
  );
};

function AuthenticatedActions({ invitationId }: { invitationId: string }) {
  const { t } = useTranslation("invitations");
  const navigate = useNavigate();
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    await authClient.organization.acceptInvitation(
      { invitationId },
      {
        onSuccess: () => {
          toast.success(t("accepted"));
          navigate({ to: "/dashboard" });
        },
        onError: ({ error }) => {
          setAccepting(false);
          toast.error(error.message || t("acceptError"));
        },
      },
    );
  };

  const handleDecline = async () => {
    setDeclining(true);
    await authClient.organization.rejectInvitation(
      { invitationId },
      {
        onSuccess: () => {
          toast.success(t("declined"));
          navigate({ to: "/" });
        },
        onError: ({ error }) => {
          setDeclining(false);
          toast.error(error.message || t("declineError"));
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        className="w-full"
        onClick={handleAccept}
        disabled={accepting || declining}
      >
        {accepting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          t("acceptButton")
        )}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={handleDecline}
        disabled={accepting || declining}
      >
        {declining ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          t("declineButton")
        )}
      </Button>
    </div>
  );
}

function UnverifiedActions({
  invitationId,
  email,
}: {
  invitationId: string;
  email: string;
}) {
  const { t } = useTranslation("invitations");
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    setResending(true);
    await authClient.sendVerificationEmail(
      {
        email,
        callbackURL: `/accept-invitation/${invitationId}`,
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
        <p className="text-sm text-muted-foreground">
          {t("verifyEmailDescription")}
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={handleResend}
        disabled={resending}
      >
        {resending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          t("resendVerification")
        )}
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
          callbackURL: `/accept-invitation/${invitationId}`,
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

  const callbackURL = `/accept-invitation/${invitationId}`;

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
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">
        {t("createAccountDescription")}
      </p>

      {SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_OATH_PROVIDER_DETAILS[provider].Icon;
        return (
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onProviderSubmit(provider)}
            className="w-full"
            key={provider}
          >
            <Icon />
            {tCommon("continueWith", {
              provider: SUPPORTED_OATH_PROVIDER_DETAILS[provider].name,
            })}
          </Button>
        );
      })}

      <div className="flex items-center space-x-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">{tCommon("or")}</span>
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
    </div>
  );
}
