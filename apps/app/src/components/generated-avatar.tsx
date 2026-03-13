import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

import { cn } from "@app/ui/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@app/ui/components/avatar";

interface GeneratedAvatarProps {
  seed: string;
  backgroundColor?: string[];
  textColor?: string[];
  className?: string;
}

export const GeneratedAvatar = ({
  seed,
  backgroundColor,
  textColor,
  className,
}: GeneratedAvatarProps) => {
  const avatar = createAvatar(initials, {
    seed,
    fontWeight: 500,
    fontSize: 42,
    backgroundColor,
    textColor,
  });

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
