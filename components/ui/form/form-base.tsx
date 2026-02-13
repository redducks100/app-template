import { ReactNode } from "react";
import { useFieldContext } from "./hooks";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../field";

export type FormControlProps = {
  label: string;
  description?: string;
  labelRight?: ReactNode;
  row?: boolean;
};

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

export function FormBase({
  children,
  label,
  labelRight,
  description,
  horizontal,
  controlFirst,
  row,
}: FormBaseProps) {
  const field = useFieldContext();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const LabelBlock = (
    <>
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {labelRight}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );

  const ErrorBlock = isInvalid ? (
    <FieldError errors={field.state.meta.errors} />
  ) : null;

  const DefaultLayout = (
    <>
      <FieldContent>{LabelBlock}</FieldContent>
      {children}
      {ErrorBlock}
    </>
  );

  const ControlFirstLayout = (
    <>
      {children}
      <FieldContent>
        {LabelBlock}
        {ErrorBlock}
      </FieldContent>
    </>
  );

  const RowLayout = (
    <div className="flex items-start justify-between gap-6 p-6">
      <FieldContent className="max-w-sm">{LabelBlock}</FieldContent>

      <div className="flex-1 flex-col gap-2 max-w-64">
        {children}
        {ErrorBlock}
      </div>
    </div>
  );

  let content: ReactNode;

  if (row) {
    content = RowLayout;
  } else if (controlFirst) {
    content = ControlFirstLayout;
  } else {
    content = DefaultLayout;
  }

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      {content}
    </Field>
  );
}
