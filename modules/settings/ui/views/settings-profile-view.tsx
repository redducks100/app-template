import { type User } from "better-auth";
import { ProfileSection } from "../components/profile-section";

type SettingsProfileViewProps = {
  user: User;
};

export const SettingsProfileView = async ({
  user,
}: SettingsProfileViewProps) => {
  return <ProfileSection user={user} />;
};
