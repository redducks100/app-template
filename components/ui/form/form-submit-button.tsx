import { useFormContext } from "./hooks";
import { Button } from "../button";
import { Loader2 } from "lucide-react";

export function FormSubmitButton({
  label,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type" | "disabled"> & {
  label: string;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={isSubmitting || !canSubmit} {...props}>
          {!isSubmitting ? label : <Loader2 className="animate-spin size-4" />}
        </Button>
      )}
    </form.Subscribe>
  );
}
