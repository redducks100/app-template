import { type User } from "better-auth";
import sendEmail from "./email";
import VerificationEmailEmail from "./templates/verification-email";

type VerificationEmailEmail = {
  user: User;
  url: string;
};

export default function sendVerificationEmail({
  user,
  url,
}: VerificationEmailEmail) {
  return sendEmail({
    to: "delivered+verifyemail@resend.dev",
    subject: "Verify your email",
    react: VerificationEmailEmail({ resetUrl: url }),
  });
}
