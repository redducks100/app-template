import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { useAppForm } from "@app/ui/components/form/hooks";

export const SendDeleteAccountEmailForm = () => {
  const form = useAppForm({
    onSubmit: async () => {
      await authClient.deleteUser(undefined, {
        onError: (error) => {
          toast.error(error.error.message || "Failed to send account deletion email.");
        },
        onSuccess: () => {
          toast.success("Account deletion email sent");
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="border border-destructive/30 bg-destructive/5">
        <div className="flex items-center justify-between p-6">
          <div>
            <p className="font-medium">Delete account</p>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action is irreversible.
            </p>
          </div>
          <form.AppForm>
            <form.SubmitButton
              timer={30}
              label="Delete"
              variant="destructive"
              dontStartOnRender={true}
            />
          </form.AppForm>
        </div>
      </div>
    </form>
  );
};
