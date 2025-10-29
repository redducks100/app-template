import { ReactNode } from "react";
import { FormBase, FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../select";

export function FormSelect({
  children,
  ...props
}: FormControlProps & { children: ReactNode }) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Select
        onValueChange={(e) => field.handleChange(e)}
        value={field.state.value}
      >
        <SelectTrigger
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          id={field.name}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FormBase>
  );
}
