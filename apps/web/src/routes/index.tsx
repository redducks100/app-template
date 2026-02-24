import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      Homepage
      <Button>
        <Link to="/sign-in">Sign In</Link>
      </Button>
    </main>
  );
}
