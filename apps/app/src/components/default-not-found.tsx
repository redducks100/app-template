import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export function DefaultNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link to="/" className={buttonVariants()}>
        Go home
      </Link>
    </div>
  );
}
