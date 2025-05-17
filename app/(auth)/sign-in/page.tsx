"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AtSign, Lock } from "lucide-react";
import { LogoGoogle } from "@/components/ui/logo";
import { FormLabel } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { signInSchema } from "@/server/schemas/sign-in-schema";

import type { AnyFieldApi } from "@tanstack/react-form";
import { signIn } from "@/server/actions/sign-in";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <small className="text-[0.8rem] font-medium text-destructive">
          {field.state.meta.errors.map((err) => err.message).join("\n")}
        </small>
      ) : null}
    </>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value: request, formApi }) => {
      const response = await signIn(request);

      if (response && response.data?.success) {
        router.push("/dashboard");
      } else {
        toast.error("Invalid username and/or password!");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account using your preferred method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
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
          <div className="w-full">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="space-y-2">
                <form.Field
                  name="email"
                  children={(field) => (
                    <>
                      <FormLabel field={field}>Email</FormLabel>
                      <div className="relative">
                        <AtSign className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id={field.name}
                          name={field.name}
                          className="pl-9"
                          placeholder="user@email.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <form.Field
                  name="password"
                  children={(field) => (
                    <>
                      <div className="flex items-center justify-between">
                        <FormLabel field={field}>Password</FormLabel>
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs"
                          type="button"
                        >
                          Forgot password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          className="pl-9"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    Sign in
                  </Button>
                )}
              />
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
