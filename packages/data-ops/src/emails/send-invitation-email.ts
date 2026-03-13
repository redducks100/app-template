import sendEmail from "./email";
import InvitationEmail from "./templates/invitation-email";

type SendInvitationEmailParams = {
  email: string;
  inviterName: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
};

export default function sendInvitationEmail({
  email,
  inviterName,
  organizationName,
  role,
  inviteUrl,
}: SendInvitationEmailParams) {
  return sendEmail({
    to: "delivered+invitation@resend.dev",
    subject: `You've been invited to join ${organizationName}`,
    react: InvitationEmail({ inviterName, organizationName, role, inviteUrl }),
  });
}
