import { useFormContext } from "./hooks";
import { Button } from "../button";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function FormSubmitButton({
  label,
  timer,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "type" | "disabled"> & {
  label: string;
  timer?: number;
}) {
  const form = useFormContext();
  const [timeToNextSubmit, setTimeToNextSubmit] = useState(timer ?? 0);
  const interval = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    startCountdown();
  }, []);

  function startCountdown(time = timer) {
    if (time && time > 0) {
      setTimeToNextSubmit(time);

      interval.current = setInterval(() => {
        setTimeToNextSubmit((t) => {
          const newTime = t - 1;

          if (newTime <= 0) {
            clearInterval(interval.current);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
  }

  const submit = async () => {
    await form.handleSubmit();
    startCountdown();
  };

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          disabled={isSubmitting || !canSubmit || timeToNextSubmit > 0}
          onClick={timer ? submit : undefined}
          {...props}
        >
          {!isSubmitting ? label : <Loader2 className="animate-spin size-4" />}
          {timeToNextSubmit > 0 && ` (${timeToNextSubmit})`}
        </Button>
      )}
    </form.Subscribe>
  );
}
