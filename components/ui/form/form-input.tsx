import type { LucideIcon } from "lucide-react";
import { Input } from "../input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../input-group";
import { FormBase, FormControlProps } from "./form-base";
import { useFieldContext, useFormContext } from "./hooks";
import { HTMLInputTypeAttribute } from "react";

export function FormInput({
  placeholder,
  type,
  LeftIcon,
  ...props
}: FormControlProps & {
  LeftIcon?: LucideIcon;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          type={type}
          placeholder={placeholder}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
        />
        {LeftIcon && (
          <InputGroupAddon>
            <LeftIcon />
          </InputGroupAddon>
        )}
      </InputGroup>
    </FormBase>
  );
}
