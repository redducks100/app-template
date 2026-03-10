import { useSuspenseQuery } from "@tanstack/react-query";
import { rolePermissionsOptions } from "@/lib/query-options/roles";
import { membersPermissionsOptions } from "@/lib/query-options/members";
import { invitationPermissionsOptions } from "@/lib/query-options/invitations";
import { organizationPermissionsOptions } from "@/lib/query-options/organizations";

export function useRolePermissions() {
  const { data } = useSuspenseQuery(rolePermissionsOptions());
  return data;
}

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
