import { Link, useRouter } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";

export function DefaultNotFound() {
  const router = useRouter();

  return (
    <div className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/5 absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full blur-3xl" />
        <div className="bg-primary/5 absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-6 text-center">
        <p className="text-primary/20 select-none text-[10rem] leading-none font-black tracking-tight sm:text-[14rem]">
          404
        </p>

        <div className="-mt-10 flex flex-col gap-2">
          <h1 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            Page not found
          </h1>
          <p className="text-muted-foreground max-w-md text-base">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="mt-2 flex gap-3">
          <button
            onClick={() => router.history.back()}
            className={buttonVariants({ variant: "outline" })}
          >
            Go back
          </button>
          <Link to="/" className={buttonVariants()}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
