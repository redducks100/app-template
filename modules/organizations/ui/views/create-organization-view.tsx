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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeftIcon,
  BuildingIcon,
  CircleAlertIcon,
  Link2Icon,
} from "lucide-react";
import { createOrganizationSchema } from "@/modules/schemas/create-organization-schema";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Alert, AlertTitle } from "@/components/ui/alert";

interface CreateOrganizationViewProps {
  canGoBack: boolean;
}

export const CreateOrganizationView = ({
  canGoBack,
}: CreateOrganizationViewProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string | null>();

  const createOrganization = useMutation(
    trpc.organizations.create.mutationOptions({
      onSuccess: async (response) => {
        await authClient.organization.setActive({
          organizationId: response.id,
        });

        await queryClient.invalidateQueries(
          trpc.organizations.getMany.queryOptions(),
        );

        await queryClient.invalidateQueries(
          trpc.organizations.getActiveOrganization.queryOptions(),
        );

        router.push("/dashboard");
      },
      onError: (error) => {
        setLoading(false);
        setError(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;

    const generatedSlug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    form.setValue("name", name);
    form.setValue("slug", generatedSlug);
    form.clearErrors("slug");
  };

  const onSubmit = async (values: z.infer<typeof createOrganizationSchema>) => {
    setLoading(true);
    setError(null);
    createOrganization.mutate(values);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Card className="relative">
      {canGoBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="absolute top-4 left-2 p-2 size-8"
        >
          <ArrowLeftIcon className="size-4" />
        </Button>
      )}
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create Organization
        </CardTitle>
        <CardDescription className="text-center">
          Create a new organization to collaborate with your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <BuildingIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Acme organization"
                        className="pl-9"
                        {...field}
                        onChange={handleNameChange}
                        disabled={loading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Link2Icon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="acme-organization"
                        className="pl-9"
                        {...field}
                        disabled={loading}
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
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              Create Organization
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-center text-muted-foreground">
          By creating an organization, you agree to our Terms of Service and
          Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
};
