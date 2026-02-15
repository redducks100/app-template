import { ReactNode } from "react";
import { FormBase, FormControlProps } from "./form-base";
import { useFieldContext } from "./hooks";
import { Select, SelectContent, SelectTrigger, SelectValue } from "../select";

export function FormSelect({
  children,
  placeholder,
  items,
  ...props
}: FormControlProps & {
  children: ReactNode;
  placeholder?: string;
  items?: Array<{ value: string; label: string }>;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Select
        items={items}
        onValueChange={(e) => field.handleChange(e ?? "")}
        value={field.state.value}
      >
        <SelectTrigger
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
          id={field.name}
          className="w-full"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </FormBase>
  );
}
