import { type User } from "better-auth";
import { AccountProfileCard } from "../components/account-profile-card";

type AccountViewProps = {
  user: User;
};

export const AccountView = ({ user }: AccountViewProps) => {
  return (
    <div className="p-4 space-y-12">
      <AccountProfileCard user={user} />
    </div>
  );
};
