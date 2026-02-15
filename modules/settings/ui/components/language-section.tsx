"use client";

import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { updateLanguageSchema } from "@/modules/schemas/update-language-schema";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type LanguageSectionProps = {
  locale: "en" | "ro";
};

export const LanguageSection = ({ locale }: LanguageSectionProps) => {
  const t = useTranslations("settings.language");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const trpc = useTRPC();

  const updateLanguage = useMutation(
    trpc.user.updateLanguage.mutationOptions({
      onSuccess: () => {
        toast.success(t("success"));
        router.refresh();
      },
      onError: () => {
        toast.error(t("error"));
      },
    }),
  );

  const items = [
    { value: "en", label: t("english") },
    { value: "ro", label: t("romanian") },
  ];

  const form = useAppForm({
    defaultValues: {
      locale: locale,
    },
    validators: {
      onSubmit: updateLanguageSchema,
    },
    onSubmit: async ({ value }) => {
      await updateLanguage.mutateAsync(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <section>
          <h3 className="text-base font-semibold text-foreground mb-4">
            {t("title")}
          </h3>
          <div className="rounded-xl border border-border bg-card">
            <form.AppField name="locale">
              {(field) => (
                <field.Select
                  label={t("label")}
                  description={t("description")}
                  items={items}
                  row
                >
                  <SelectItem value="en">{t("english")}</SelectItem>
                  <SelectItem value="ro">{t("romanian")}</SelectItem>
                </field.Select>
              )}
            </form.AppField>
          </div>
        </section>

        <Field>
          <form.AppForm>
            <div className="flex justify-end">
              <form.SubmitButton label={tCommon("change")} />
            </div>
          </form.AppForm>
        </Field>
      </FieldGroup>
    </form>
  );
};
