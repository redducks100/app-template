import { useEffect } from "react";
import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { getLogger } from "@app/shared/logger";
import { Button } from "@/components/ui/button";

export function DefaultCatchBoundary({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  useEffect(() => {
    getLogger().error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex gap-2">
        <Button
          onClick={() => {
            reset();
            router.invalidate();
          }}
        >
          Try again
        </Button>
        <Button variant="outline" render={<Link to="/" />}>
          Go home
        </Button>
      </div>
    </div>
  );
}
