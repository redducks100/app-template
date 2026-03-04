import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">App Template</h1>
      <p className="text-lg text-gray-600">Welcome to the landing page.</p>
      <a
        href="https://app.enomisoft.com"
        className="px-6 py-3 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
      >
        Go to App
      </a>
    </main>
  );
}
