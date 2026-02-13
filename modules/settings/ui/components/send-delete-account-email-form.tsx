import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

export const SendDeleteAccountEmailForm = () => {
  const form = useAppForm({
    onSubmit: async () => {
      await authClient.deleteUser(undefined, {
        onError: (error) => {
          toast.error(
            error.error.message || "Failed to send account deletion email."
          );
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
      <section>
        <h3 className="text-base font-semibold text-destructive mb-4">
          Danger Zone
        </h3>
        <div className="rounded-xl border border-destructive/30 bg-destructive/5">
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium">Delete account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This
                action is irreversible.
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
      </section>
    </form>
  );
};
