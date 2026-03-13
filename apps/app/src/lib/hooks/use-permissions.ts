import { useSuspenseQuery } from "@tanstack/react-query";

import { invitationPermissionsOptions } from "@/lib/queries/invitations";
import { membersPermissionsOptions } from "@/lib/queries/members";
import { organizationPermissionsOptions } from "@/lib/queries/organizations";

export function useMemberPermissions() {
  const { data } = useSuspenseQuery(membersPermissionsOptions());
  return data;
}

export function useInvitationPermissions() {
  const { data } = useSuspenseQuery(invitationPermissionsOptions());
  return data;
}

export function useOrganizationPermissions() {
  const { data } = useSuspenseQuery(organizationPermissionsOptions());
  return data;
}
