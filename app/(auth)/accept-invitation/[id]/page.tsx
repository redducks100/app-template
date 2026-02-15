import { AcceptInvitationView } from "@/modules/invitations/ui/views/accept-invitation-view";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AcceptInvitationView invitationId={id} />;
};

export default Page;
