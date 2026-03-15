import { Loader2 } from "lucide-react";

import { Button } from "./button";

type LoaderButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  icon?: React.ReactNode;
};

export const LoaderButton = ({
  loading,
  icon,
  disabled,
  children,
  ...props
}: LoaderButtonProps) => (
  <Button disabled={loading || disabled} {...props}>
    {loading ? <Loader2 className="animate-spin" /> : icon}
    {children}
  </Button>
);
