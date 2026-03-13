import type { ColumnDef } from "@tanstack/react-table";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";

import { DEFAULT_PAGE_SIZE } from "@app/shared/types/result";
import {
  DataTable,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
} from "@app/ui/components/data-table";

import type { InvitationListItem } from "./invitations-columns";

interface InvitationsDesktopDataTableProps {
  invitations: InvitationListItem[];
  columns: ColumnDef<InvitationListItem>[];
  totalRows: number;
  page: number;
  search: string;
  onSearchChange: (value: string) => void;
  noResultsMessage: string;
  onPaginationChange: OnChangeFn<PaginationState>;
}

export const InvitationsDesktopDataTable = ({
  invitations,
  columns,
  totalRows,
  page,
  search,
  onSearchChange,
  noResultsMessage,
  onPaginationChange,
}: InvitationsDesktopDataTableProps) => {
  return (
    <DataTable
      data={invitations}
      columns={columns}
      totalRows={totalRows}
      search={search}
      onSearchChange={onSearchChange}
      pagination={{ pageIndex: page - 1, pageSize: DEFAULT_PAGE_SIZE }}
      onPaginationChange={onPaginationChange}
    >
      <DataTableSearch />
      <DataTableContent noResultsMessage={noResultsMessage} />
      <DataTablePagination />
    </DataTable>
  );
};
