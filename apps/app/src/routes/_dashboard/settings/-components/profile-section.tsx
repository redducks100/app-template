import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { type User } from "better-auth";
import { Loader2, MailIcon, Trash2, Upload, UserIcon } from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@app/ui/components/avatar";
import { Button } from "@app/ui/components/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@app/ui/components/field";
import { useAppForm } from "@app/ui/components/form/hooks";
import { Separator } from "@app/ui/components/separator";
import { authClient } from "@/lib/auth-client";
import { compressProfileImage, validateProfileImage } from "@/lib/image-utils";
import { removeAvatar, uploadAvatar } from "@/lib/mutations/user";
import { sessionOptions } from "@/lib/queries/auth";
import { getInitials } from "@app/ui/lib/utils";
import { updateUserProfileSchema } from "@app/shared/schemas/update-user-profile-schema";

type ProfileSectionProps = {
  user: User;
};

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const { t } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");
  const queryClient = useQueryClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const dataUrl = await compressProfileImage(file);
      await uploadAvatar({ image: dataUrl });
      const { data } = await authClient.getSession({
        query: { disableCookieCache: true },
      });
      queryClient.setQueryData(sessionOptions().queryKey, data);
    },
    onSuccess: () => {
      router.invalidate();
      toast.success(t("profile.avatarUploaded"));
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      await removeAvatar();
      const { data } = await authClient.getSession({
        query: { disableCookieCache: true },
      });
      queryClient.setQueryData(sessionOptions().queryKey, data);
    },
    onSuccess: () => {
      router.invalidate();
      toast.success(t("profile.avatarRemoved"));
    },
  });

  const isAvatarLoading = uploadMutation.isPending || removeMutation.isPending;

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
          callbackURL: new URL("/settings/profile", window.location.origin).href,
        });
      }

      const res = await Promise.all(promises);

      const updateUserResult = res[0];
      const emailResult = res[1] ?? { error: false };

      if (updateUserResult.error) {
        toast.error(updateUserResult.error.message || t("profile.updateProfileError"));
      } else if (emailResult.error) {
        toast.error(emailResult.error.message || t("profile.changeEmailError"));
      } else {
        if (value.email !== user.email) {
          toast.success(t("profile.verifyNewEmail"));
        }
      }
    },
  });
  const userInitials = getInitials(user.name);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-4 p-6">
            <Avatar className="size-14 rounded-lg">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>{userInitials}</AvatarFallback>
              {isAvatarLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-[inherit]">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              )}
            </Avatar>
            <div className="flex-1">
              <FieldLabel>{t("profile.profilePicture")}</FieldLabel>
              <FieldDescription>{t("profile.profilePictureDescription")}</FieldDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex gap-2"
                disabled={isAvatarLoading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="size-4" />
                {user.image ? tCommon("change") : tCommon("upload")}
              </Button>
              {user.image && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex gap-2"
                  disabled={isAvatarLoading}
                  onClick={() => removeMutation.mutate()}
                >
                  <Trash2 className="size-4" />
                  {tCommon("remove")}
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const error = validateProfileImage(file);
                  if (error) {
                    toast.error(t(`profile.${error}`));
                    e.target.value = "";
                    return;
                  }
                  uploadMutation.mutate(file);
                  e.target.value = "";
                }
              }}
            />
          </div>

          <Separator orientation="horizontal" />

          <form.AppField name="name">
            {(field) => (
              <field.Input
                label={t("profile.name")}
                description={t("profile.nameDescription")}
                placeholder={t("profile.namePlaceholder")}
                LeftIcon={UserIcon}
                row
              />
            )}
          </form.AppField>

          <Separator orientation="horizontal" />

          <form.AppField name="email">
            {(field) => (
              <field.Input
                label={t("profile.email")}
                description={t("profile.emailDescription")}
                placeholder={t("profile.emailPlaceholder")}
                LeftIcon={MailIcon}
                row
              />
            )}
          </form.AppField>
        </div>

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
