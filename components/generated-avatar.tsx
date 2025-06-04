import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
}

export const GeneratedAvatar = ({ seed, className }: GeneratedAvatarProps) => {
  const avatar = createAvatar(initials, {
    seed,
    fontWeight: 500,
    fontSize: 42,
  });

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
