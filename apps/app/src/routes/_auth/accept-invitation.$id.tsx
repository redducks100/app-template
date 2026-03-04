import { createFileRoute, Link } from "@tanstack/react-router";
import { AcceptInvitationView } from "./-components/accept-invitation-view";
import { invitationGetOptions } from "@/lib/query-options";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_auth/accept-invitation/$id")({
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
        <CardTitle className="text-2xl font-bold">
          {t("notFoundTitle")}
        </CardTitle>
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
