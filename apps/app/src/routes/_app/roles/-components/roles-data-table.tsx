import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { createRoleColumns } from "./roles-columns";
import {
  rolesListOptions,
  activeOrganizationOptions,
} from "@/lib/query-options";
import { deleteRole as deleteRoleMutation } from "@/lib/mutations";

export const RolesDataTable = () => {
  const { t } = useTranslation("roles");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: roles } = useSuspenseQuery(rolesListOptions());

  const { data: activeOrg } = useSuspenseQuery(activeOrganizationOptions());

  const isOwner = activeOrg?.role === "owner";

  const invalidateRoles = async () => {
    await queryClient.invalidateQueries({ queryKey: ["roles", "list"] });
  };

  const deleteRole = useMutation({
    mutationFn: deleteRoleMutation,
    onSuccess: async () => {
      await invalidateRoles();
      toast.success(t("deleteSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const columns = createRoleColumns(
    (roleId) => deleteRole.mutate({ roleId }),
    deleteRole.isPending,
    isOwner,
    t,
  );

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (roles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t("emptyState")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() =>
                navigate({ to: `/roles/${row.original.id}` })
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
