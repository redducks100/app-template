import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      Homepage
      <Button asChild>
        <a href="/sign-in">Sign In</a>
      </Button>
    </main>
  );
}
