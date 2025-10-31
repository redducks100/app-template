import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { type User } from "better-auth";

type ForgotPasswordEmailProps = {
  user: User;
  resetUrl: string;
};

export const ForgotPasswordEmail = ({
  user,
  resetUrl,
}: ForgotPasswordEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl p-8 mx-auto max-w-[600px]">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-4 mt-0">
                Reset Your Password
              </Text>

              <Text className="text-[16px] text-gray-700 mb-6 mt-0 leading-6">
                We received a request to reset your password. If you didn't make
                this request, you can safely ignore this email.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-8 mt-0 leading-6">
                To reset your password, click the button below:
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[16px] font-medium no-underline box-border"
                >
                  Reset Your Password
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-6 mt-0 leading-5">
                This link will expire in 24 hours for security reasons.
              </Text>

              <Hr className="border-gray-200 my-8" />

              <Text className="text-[14px] text-gray-600 mb-2 mt-0">
                If you're having trouble clicking the button, copy and paste the
                URL below into your web browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-8 mt-0 break-all">
                {resetUrl}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
