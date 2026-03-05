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
import { toast } from "sonner";
import { createInvitationColumns } from "./invitations-columns";
import { invitationsListOptions } from "@/lib/query-options";
import { cancelInvitation as cancelInvitationMutation } from "@/lib/mutations";

export const InvitationsDataTable = () => {
  const { t } = useTranslation("invitations");
  const { t: tCommon } = useTranslation("common");
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: invitations } = useSuspenseQuery(invitationsListOptions());

  const cancelInvitation = useMutation({
    mutationFn: cancelInvitationMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["invitations", "list"],
      });
      toast.success(t("canceled"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const columns = createInvitationColumns(
    (invitationId) => cancelInvitation.mutate({ invitationId }),
    cancelInvitation.isPending,
    t,
  );

  const table = useReactTable({
    data: invitations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } },
  });

  if (invitations.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">{t("emptyState")}</p>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
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
