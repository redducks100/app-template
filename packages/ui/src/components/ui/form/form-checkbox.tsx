import { Checkbox } from "../checkbox";
import { FormBase, FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";

export function FormCheckbox(props: FormControlProps) {
  const field = useFieldContext<boolean>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} controlFirst horizontal>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
        aria-invalid={isInvalid}
      />
    </FormBase>
  );
}
