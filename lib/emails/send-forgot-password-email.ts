import { type User } from "better-auth";
import sendEmail from "./email";
import { ForgotPasswordEmail } from "./templates/forgot-password-email";

type ForgotPasswordEmail = {
  user: User;
  url: string;
};

export default function sendForgotPasswordEmail({
  user,
  url,
}: ForgotPasswordEmail) {
  return sendEmail({
    to: "delivered+forgotpassword@resend.dev",
    subject: "Reset your password",
    react: ForgotPasswordEmail({ resetUrl: url }),
  });
}
