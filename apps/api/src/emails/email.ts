import { Resend } from "resend";

let resend: Resend;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

type SendEmailProps = {
  to: string;
  subject: string;
  react: React.ReactNode;
};

export default function sendEmail({ to, subject, react }: SendEmailProps) {
  return getResend().emails.send({
    from: "EnomiSoft <noreply@noreply.enomisoft.com>",
    to: to,
    subject: subject,
    react: react,
  });
}
