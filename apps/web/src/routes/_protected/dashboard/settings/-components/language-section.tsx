import { useAppForm } from "@/components/ui/form/hooks";
import { Field, FieldGroup } from "@/components/ui/field";
import { SelectItem } from "@/components/ui/select";
import { updateLanguageSchema } from "@app/shared/schemas/update-language-schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { updateLanguage as updateLanguageMutation } from "@/lib/mutations";

type LanguageSectionProps = {
  locale: "en" | "ro";
};

export const LanguageSection = ({ locale }: LanguageSectionProps) => {
  const { t, i18n } = useTranslation("settings");
  const { t: tCommon } = useTranslation("common");

  const updateLanguage = useMutation({
    mutationFn: updateLanguageMutation,
    onSuccess: (_data, variables) => {
      i18n.changeLanguage(variables.locale);
      toast.success(t("language.success"));
    },
    onError: () => {
      toast.error(t("language.error"));
    },
  });

  const items = [
    { value: "en", label: t("language.english") },
    { value: "ro", label: t("language.romanian") },
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
            {t("language.title")}
          </h3>
          <div className="rounded-xl border border-border bg-card">
            <form.AppField name="locale">
              {(field) => (
                <field.Select
                  label={t("language.label")}
                  description={t("language.description")}
                  items={items}
                  row
                >
                  <SelectItem value="en">{t("language.english")}</SelectItem>
                  <SelectItem value="ro">{t("language.romanian")}</SelectItem>
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
