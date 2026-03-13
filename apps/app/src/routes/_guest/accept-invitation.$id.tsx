import { Link, createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { buttonVariants } from "@app/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@app/ui/components/card";
import { invitationGetOptions } from "@/lib/queries/invitations";

import { AcceptInvitationView } from "./-components/accept-invitation-view";

export const Route = createFileRoute("/_guest/accept-invitation/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(invitationGetOptions(params.id)),
  component: AcceptInvitationPage,
  errorComponent: AcceptInvitationError,
});

function AcceptInvitationPage() {
  const { id } = Route.useParams();
  return (
    <Suspense>
      <AcceptInvitationView invitationId={id} />
    </Suspense>
  );
}

function AcceptInvitationError() {
  const { t } = useTranslation("invitations");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("notFoundTitle")}</CardTitle>
        <CardDescription>{t("notFoundDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link to="/sign-in" className={buttonVariants({ className: "w-full" })}>
          {t("goToSignIn")}
        </Link>
      </CardContent>
    </Card>
  );
}
