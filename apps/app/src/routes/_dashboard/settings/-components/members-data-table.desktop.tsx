import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";
import {
  DataTable,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
} from "@app/ui/components/data-table";

import type { MemberColumn } from "./members-columns";

interface MembersDesktopDataTableProps {
  members: MemberColumn[];
  columns: ColumnDef<MemberColumn>[];
  totalRows: number;
  page: number;
  search: string;
  onSearchChange: (value: string) => void;
  noResultsMessage: string;
  onPaginationChange: OnChangeFn<PaginationState>;
  onRowClick: (row: MemberColumn) => void;
}

export const MembersDesktopDataTable = ({
  members,
  columns,
  totalRows,
  page,
  search,
  onSearchChange,
  noResultsMessage,
  onPaginationChange,
  onRowClick,
}: MembersDesktopDataTableProps) => {
  return (
    <DataTable
      data={members}
      columns={columns}
      totalRows={totalRows}
      search={search}
      onSearchChange={onSearchChange}
      pagination={{ pageIndex: page - 1, pageSize: DEFAULT_PAGE_SIZE }}
      onPaginationChange={onPaginationChange}
      onRowClick={onRowClick}
    >
      <DataTableSearch />
      <DataTableContent noResultsMessage={noResultsMessage} />
      <DataTablePagination />
    </DataTable>
  );
};
