import { MultiSelect } from "../multi-select";
import { FormBase, FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormMultiSelect({
  options,
  placeholder,
  ...props
}: FormControlProps & {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  const field = useFieldContext<string[]>();

  return (
    <FormBase {...props}>
      <MultiSelect
        options={options}
        value={field.state.value ?? []}
        onChange={field.handleChange}
        onBlur={field.handleBlur}
        placeholder={placeholder}
      />
    </FormBase>
  );
}
