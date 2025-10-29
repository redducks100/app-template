import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FormInput } from "./form-input";
import { FormTextarea } from "./form-textarea";
import { FormSelect } from "./form-select";
import { FormCheckbox } from "./form-checkbox";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
  },
  formComponents: {},
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
