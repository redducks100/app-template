import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { FormCheckbox } from "./form-checkbox";
import { FormInput } from "./form-input";
import { FormMultiSelect } from "./form-multi-select";
import { FormSelect } from "./form-select";
import { FormSubmitButton } from "./form-submit-button";
import { FormTextarea } from "./form-textarea";

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldComponents: {
    Input: FormInput,
    Textarea: FormTextarea,
    Select: FormSelect,
    Checkbox: FormCheckbox,
    MultiSelect: FormMultiSelect,
  },
  formComponents: {
    SubmitButton: FormSubmitButton,
  },
  fieldContext,
  formContext,
});

export { useAppForm, useFieldContext, useFormContext };
