import { type User } from "better-auth";
import sendEmail from "./email";
import VerificationEmailEmail from "./templates/verification-email";
import DeleteAccountEmail from "./templates/delete-account-email";

type DeleteAccountEmail = {
  user: User;
  url: string;
};

export default function sendVerificationEmail({
  user,
  url,
}: DeleteAccountEmail) {
  return sendEmail({
    to: "delivered+deleteaccount@resend.dev",
    subject: "Delete your account",
    react: DeleteAccountEmail({ deleteUrl: url }),
  });
}
