"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogoGoogle } from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";
import {
  AtSignIcon,
  CircleAlertIcon,
  LockIcon,
  OctagonAlertIcon,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInSchema } from "@/server/schemas/sign-in-schema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SignInView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    setError(null);
    setLoading(true);

    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.message);
        },
      },
    );
  };

  const onGoogleSubmit = () => {
    setLoading(true);
    authClient.signIn.social(
      { provider: "google", callbackURL: "/dashboard" },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: ({ error }) => {
          setLoading(false);
          setError(error.message);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account using your preferred method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          disabled={loading}
          onClick={onGoogleSubmit}
          className="w-full justify-between border-gray-300"
        >
          <div className="flex items-center">
            <LogoGoogle />
            Continue with Google
          </div>
        </Button>

        <div className="flex items-center space-x-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSignIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="you@example.com"
                        className="pl-9"
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs"
                      type="button"
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <LockIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        type="password"
                        className="pl-9"
                        disabled={loading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!!error && (
              <Alert className="bg-destructive/10 border-none">
                <CircleAlertIcon className="h-4 w-4 !text-destructive" />
                <AlertTitle className="text-sm">{error}</AlertTitle>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
        <div className="text-center mt-2">
          <span className="text-sm text-muted-foreground mr-2">
            Don&apos;t have an account?
          </span>
          <Button asChild variant="link" className="p-0 h-auto text-sm">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
