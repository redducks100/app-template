import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { createRoleColumns } from "./roles-columns";
import {
  rolesListOptions,
  activeOrganizationOptions,
} from "@/lib/query-options";
import { deleteRole as deleteRoleMutation } from "@/lib/mutations";
import { ShieldIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const RolesDataTable = () => {
  const { t } = useTranslation("roles");
  const { t: tCommon } = useTranslation("common");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");

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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } },
  });

  if (roles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-muted p-3 text-muted-foreground">
            <ShieldIcon className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-medium">{t("emptyState")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("noCustomRoles")}</p>
          {isOwner && (
            <Link to="/roles/create">
              <Button size="sm" className="mt-4">
                <PlusIcon className="size-4" />
                {t("createRole")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar value={globalFilter} onChange={setGlobalFilter} />

      <div className="rounded-xl border border-border bg-card shadow-xs">
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer transition-colors duration-150"
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {tCommon("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
};
