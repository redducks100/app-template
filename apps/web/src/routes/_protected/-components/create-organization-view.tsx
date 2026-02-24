import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import z from "zod";
import { ArrowLeftIcon, BuildingIcon, Link2Icon } from "lucide-react";
import { createOrganizationSchema } from "@app/shared/schemas/create-organization-schema";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { toast } from "sonner";
import { createOrganization as createOrganizationMutation } from "@/lib/mutations";

type CreateOrganizationViewProps = {
  canGoBack: boolean;
};

type FormData = z.infer<typeof createOrganizationSchema>;

export const CreateOrganizationView = ({
  canGoBack,
}: CreateOrganizationViewProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>();

  const createOrganization = useMutation({
    mutationFn: createOrganizationMutation,
    onSuccess: async (response) => {
      await authClient.organization.setActive({
        organizationId: response.id,
      });

      await queryClient.invalidateQueries({
        queryKey: ["organizations", "list"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["organizations", "active"],
      });

      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
  });

  const form = useAppForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    validators: {
      onSubmit: createOrganizationSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await createOrganization.mutateAsync(value);
    },
  });

  const handleBack = () => {
    window.history.back();
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="name"
              listeners={{
                onChange: ({ value }) => {
                  const generatedSlug = value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-");

                  form.setFieldValue("slug", generatedSlug);
                },
              }}
            >
              {(field) => (
                <field.Input
                  label="Name"
                  placeholder="Acme organization"
                  LeftIcon={BuildingIcon}
                />
              )}
            </form.AppField>
            <form.AppField name="slug">
              {(field) => (
                <field.Input
                  label="Slug URL"
                  placeholder="acme-organization"
                  LeftIcon={Link2Icon}
                />
              )}
            </form.AppField>
            <Field>
              <form.AppForm>
                <form.SubmitButton label="Create organization" />
              </form.AppForm>
              <p className="text-xs text-center text-muted-foreground">
                By creating an organization, you agree to our Terms of Service
                and Privacy Policy.
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
