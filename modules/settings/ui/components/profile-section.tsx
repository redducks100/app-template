"use client";

import { MailIcon, Upload, UserIcon } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

type ProfileSectionProps = {
  user: User;
};

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const router = useRouter();
  const t = useTranslations("settings.profile");
  const tCommon = useTranslations("common");
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
          callbackURL: "/dashboard/settings/profile",
        });
      }

      const res = await Promise.all(promises);

      const updateUserResult = res[0];
      const emailResult = res[1] ?? { error: false };

      if (updateUserResult.error) {
        toast.error(
          updateUserResult.error.message || t("updateProfileError"),
        );
      } else if (emailResult.error) {
        toast.error(emailResult.error.message || t("changeEmailError"));
      } else {
        if (value.email !== user.email) {
          toast.success(t("verifyNewEmail"));
        }
        router.refresh();
      }
    },
  });
  const userInitials = `${user.name.charAt(0).toUpperCase()}${user.name
    .charAt(1)
    .toUpperCase()}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            {t("display")}
          </h3>
          <div className="rounded-xl border border-border bg-card">
            <Field>
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarImage src={user.image ?? undefined} />
                    <AvatarFallback className="rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <FieldLabel>{t("profilePicture")}</FieldLabel>
                    <FieldDescription>{t("profilePictureDescription")}</FieldDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex gap-2">
                  <Upload className="size-4" />
                  {tCommon("upload")}
                </Button>
              </div>
            </Field>

            <Separator orientation="horizontal" />

            {/* Name row */}
            <form.AppField name="name">
              {(field) => (
                <field.Input
                  label={t("name")}
                  description={t("nameDescription")}
                  placeholder={t("namePlaceholder")}
                  LeftIcon={UserIcon}
                  row
                />
              )}
            </form.AppField>
          </div>
        </section>

        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            {t("contact")}
          </h3>
          <div className="rounded-xl border border-border bg-card">
            <form.AppField name="email">
              {(field) => (
                <field.Input
                  label={t("email")}
                  description={t("emailDescription")}
                  placeholder={t("emailPlaceholder")}
                  LeftIcon={MailIcon}
                  row
                />
              )}
            </form.AppField>
          </div>
        </section>

        <Field>
          <form.AppForm>
            <div className="flex justify-end">
              <form.SubmitButton label={tCommon("update")} />
            </div>
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
