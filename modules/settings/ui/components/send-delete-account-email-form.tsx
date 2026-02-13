import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
      <FieldGroup>
        <Field>
          <FieldLabel>Delete account</FieldLabel>
          <FieldDescription>
            We will send you a delete account email to confirm your request.
          </FieldDescription>
          <form.AppForm>
            <form.SubmitButton
              className="md:max-w-fit"
              timer={30}
              label="Delete"
              variant="destructive"
              dontStartOnRender={true}
            />
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
