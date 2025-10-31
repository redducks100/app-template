import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailProps = {
  to: string;
  subject: string;
  react: React.ReactNode;
};

export default function sendEmail({ to, subject, react }: SendEmailProps) {
  return resend.emails.send({
    from: "Enomisoft <noreply@noreply.enomisoft.com>",
    to: to,
    subject: subject,
    react: react,
  });
}
