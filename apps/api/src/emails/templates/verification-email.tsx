import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

type VerificationEmailEmailProps = {
  resetUrl: string;
};

export const VerificationEmailEmail = ({
  resetUrl,
}: VerificationEmailEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl p-8 mx-auto max-w-[600px]">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-4 mt-0">
                Verify Your Email Address
              </Text>

              <Text className="text-[16px] text-gray-700 mb-6 mt-0 leading-6">
                Thank you for signing up! To complete your registration, please
                verify your email address.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-8 mt-0 leading-6">
                To verify your email address, click the button below:
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[16px] font-medium no-underline box-border"
                >
                  Verify Your Email
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-6 mt-0 leading-5">
                This verification link will expire in 24 hours for security
                reasons.
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

export default VerificationEmailEmail;
