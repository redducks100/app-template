import type { FilterFn, PaginationState, Updater } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
} from "@app/ui/components/data-table";

import type { MemberColumn } from "./members-columns";

const memberGlobalFilterFn: FilterFn<MemberColumn> = (row, _columnId, filterValue) => {
  const search = String(filterValue).toLowerCase();
  const name = (row.original.user?.name ?? "").toLowerCase();
  const email = (row.original.user?.email ?? "").toLowerCase();
  const role = (row.original.role ?? "").toLowerCase();
  return name.includes(search) || email.includes(search) || role.includes(search);
};

interface MembersDesktopDataTableProps {
  members: MemberColumn[];
  columns: ColumnDef<MemberColumn>[];
  page: number;
  noResultsMessage: string;
  onPaginationChange: (updater: Updater<PaginationState>) => void;
  onRowClick: (row: MemberColumn) => void;
}

export const MembersDesktopDataTable = ({
  members,
  columns,
  page,
  noResultsMessage,
  onPaginationChange,
  onRowClick,
}: MembersDesktopDataTableProps) => {
  return (
    <DataTable
      data={members}
      columns={columns}
      globalFilterFn={memberGlobalFilterFn}
      pagination={{ pageIndex: page - 1, pageSize: 10 }}
      onPaginationChange={onPaginationChange}
      onRowClick={onRowClick}
    >
      <DataTableSearch />
      <DataTableContent noResultsMessage={noResultsMessage} />
      <DataTablePagination />
    </DataTable>
  );
};
