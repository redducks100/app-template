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
import { authClient } from "@/lib/auth-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type FilterFn,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { createMemberColumns } from "./members-columns";
import { membersListOptions } from "@/lib/query-options";
import { UsersIcon } from "lucide-react";

const memberGlobalFilterFn: FilterFn<any> = (row, _columnId, filterValue) => {
  const search = String(filterValue).toLowerCase();
  const name = (row.original.user?.name ?? "").toLowerCase();
  const email = (row.original.user?.email ?? "").toLowerCase();
  const role = (row.original.role ?? "").toLowerCase();
  return name.includes(search) || email.includes(search) || role.includes(search);
};

export const MembersDataTable = () => {
  const { t } = useTranslation("members");
  const { t: tCommon } = useTranslation("common");
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: session } = authClient.useSession();

  const { data } = useSuspenseQuery(membersListOptions());

  const members = data.members;
  const currentUserId = session?.user?.id ?? "";

  const columns = createMemberColumns(currentUserId, t);

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: memberGlobalFilterFn,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } },
  });

  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <div className="flex flex-col items-center">
          <div className="rounded-lg bg-muted p-3 text-muted-foreground">
            <UsersIcon className="size-6" />
          </div>
          <h3 className="mt-4 text-sm font-medium">{t("emptyState")}</h3>
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
                    navigate({ to: `/users/${row.original.id}` })
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
