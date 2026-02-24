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

type DeleteAccountEmailProps = {
  deleteUrl: string;
};

export const DeleteAccountEmail = ({ deleteUrl }: DeleteAccountEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="bg-white rounded-xl p-8 mx-auto max-w-[600px]">
            <Section>
              <Text className="text-[24px] font-bold text-gray-900 mb-4 mt-0">
                Confirm Account Deletion
              </Text>

              <Text className="text-[16px] text-gray-700 mb-6 mt-0 leading-6">
                We received a request to delete your account. If you didn't make
                this request, you can safely ignore this email and your account
                will remain active.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-8 mt-0 leading-6">
                <strong>Warning:</strong> This action is permanent and cannot be
                undone. All your data will be permanently deleted.
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={deleteUrl}
                  className="bg-red-600 text-white px-8 py-4 rounded-xl text-[16px] font-medium no-underline box-border"
                >
                  Delete My Account
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-6 mt-0 leading-5">
                This deletion link will expire in 24 hours for security reasons.
              </Text>

              <Hr className="border-gray-200 my-8" />

              <Text className="text-[14px] text-gray-600 mb-2 mt-0">
                If you're having trouble clicking the button, copy and paste the
                URL below into your web browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-8 mt-0 break-all">
                {deleteUrl}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default DeleteAccountEmail;
