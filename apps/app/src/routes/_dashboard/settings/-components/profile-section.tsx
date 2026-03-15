import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { type User } from "better-auth";
import { Loader2, MailIcon, Trash2, Upload, UserIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { compressProfileImage, validateProfileImage } from "@/lib/image-utils";
import { removeAvatar, uploadAvatar } from "@/lib/mutations/user";
import { sessionOptions } from "@/lib/queries/auth";
import { updateUserProfileSchema } from "@app/shared/schemas/update-user-profile-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@app/ui/components/avatar";
import { FieldDescription, FieldGroup, FieldLabel } from "@app/ui/components/field";
import { useAppForm } from "@app/ui/components/form/hooks";
import { LoaderButton } from "@app/ui/components/loader-button";
import { Separator } from "@app/ui/components/separator";
import { getInitials } from "@app/ui/lib/utils";

type ProfileSectionProps = {
  user: User;
};

const DeleteAccountButton = () => {
  const { t } = useTranslation("settings");
  const [isPending, setIsPending] = useState(false);

  return (
    <LoaderButton
      type="button"
      variant="destructive"
      size="sm"
      loading={isPending}
      onClick={async () => {
        setIsPending(true);
        await authClient.deleteUser(undefined, {
          onError: (error) => {
            setIsPending(false);
            toast.error(error.error.message || t("profile.deleteAccountError"));
          },
          onSuccess: () => {
            setIsPending(false);
            toast.success(t("profile.deleteAccountEmailSent"));
          },
        });
      }}
    >
      {t("profile.deleteAccountButton")}
    </LoaderButton>
  );
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
      id="profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div>
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
              <LoaderButton
                type="button"
                variant="outline"
                size="sm"
                className="flex gap-2"
                loading={uploadMutation.isPending}
                disabled={isAvatarLoading}
                icon={<Upload className="size-4" />}
                onClick={() => fileInputRef.current?.click()}
              >
                {user.image ? tCommon("change") : tCommon("upload")}
              </LoaderButton>
              {user.image && (
                <LoaderButton
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex gap-2"
                  loading={removeMutation.isPending}
                  disabled={isAvatarLoading}
                  icon={<Trash2 className="size-4" />}
                  onClick={() => removeMutation.mutate()}
                >
                  {tCommon("remove")}
                </LoaderButton>
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

          <Separator orientation="horizontal" />

          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium">{t("profile.deleteAccount")}</p>
              <p className="text-sm text-muted-foreground">
                {t("profile.deleteAccountDescription")}
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </div>
      </FieldGroup>
    </form>
  );
};
