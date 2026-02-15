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

type InvitationEmailProps = {
  inviterName: string;
  organizationName: string;
  role: string;
  inviteUrl: string;
};

export const InvitationEmail = ({
  inviterName,
  organizationName,
  role,
  inviteUrl,
}: InvitationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl p-8 mx-auto max-w-[600px]">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-4 mt-0">
                You&apos;ve Been Invited
              </Text>

              <Text className="text-[16px] text-gray-700 mb-6 mt-0 leading-6">
                {inviterName} has invited you to join{" "}
                <strong>{organizationName}</strong> as a {role}.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-8 mt-0 leading-6">
                Click the button below to accept the invitation:
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={inviteUrl}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl text-[16px] font-medium no-underline box-border"
                >
                  Accept Invitation
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-6 mt-0 leading-5">
                This invitation link will expire in 48 hours for security
                reasons.
              </Text>

              <Hr className="border-gray-200 my-8" />

              <Text className="text-[14px] text-gray-600 mb-2 mt-0">
                If you&apos;re having trouble clicking the button, copy and
                paste the URL below into your web browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-8 mt-0 break-all">
                {inviteUrl}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvitationEmail;
