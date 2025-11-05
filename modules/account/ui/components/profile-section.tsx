"use client";

import { AtSignIcon, UploadIcon, UserIcon } from "lucide-react";
import { ViewSection } from "./view-section";
import { useAppForm } from "@/components/ui/form/hooks";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { updateUserProfileSchema } from "@/modules/schemas/update-user-profile-schema";
import { type User } from "better-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ProfileSectionProps = {
  user: User;
};

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      email: user.email,
      name: user.name,
    },
    validators: {
      onSubmit: updateUserProfileSchema,
    },
    onSubmit: async ({ value }) => {
      const promises = [
        authClient.updateUser({
          name: value.name,
        }),
      ];

      if (value.email !== user.email) {
        authClient.changeEmail({
          newEmail: value.email,
          callbackURL: "/dashboard/account",
        });
      }

      const res = await Promise.all(promises);

      const updateUserResult = res[0];
      const emailResult = res[1] ?? { error: false };

      if (updateUserResult.error) {
        toast.error(
          updateUserResult.error.message || "Failed to update profile"
        );
      } else if (emailResult.error) {
        toast.error(emailResult.error.message || "Failed to change email");
      } else {
        if (value.email !== user.email) {
          toast.success("Verify your new email address to complete the change");
        }
        router.refresh();
      }
    },
  });
  const userInitials = `${user.name.charAt(0).toUpperCase()}${user.name
    .charAt(1)
    .toUpperCase()}`;

  return (
    <ViewSection
      title="Profile"
      description="Manage your profile details"
      Icon={UserIcon}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <Field>
            <div className="flex items-center gap-4">
              <Avatar className="size-16 rounded-lg">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="rounded-lg">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <FieldLabel>Profile Picture</FieldLabel>
                <FieldDescription>JPG, PNG up to 5MB</FieldDescription>
              </div>
              <Button variant="secondary" className="ml-auto flex gap-2">
                <UploadIcon className="size-4" />
                Upload
              </Button>
            </div>
          </Field>
          <form.AppField name="name">
            {(field) => (
              <field.Input
                label="Name"
                description="Used for display purposes only."
                placeholder="John Smith"
                LeftIcon={UserIcon}
              />
            )}
          </form.AppField>
          <form.AppField name="email">
            {(field) => (
              <field.Input
                label="Email"
                description="Update your email address. You will need to verify the new address."
                placeholder="you@example.com"
                LeftIcon={AtSignIcon}
              />
            )}
          </form.AppField>

          <Field>
            <form.AppForm>
              <form.SubmitButton className="md:max-w-fit" label="Update" />
            </form.AppForm>
          </Field>
        </FieldGroup>
      </form>
    </ViewSection>
  );
};
