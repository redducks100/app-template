import type { ColumnDef } from "@tanstack/react-table";
import type { PaginationState, Updater } from "@tanstack/react-table";

import {
  DataTable,
  DataTableContent,
  DataTablePagination,
  DataTableSearch,
} from "@app/ui/components/data-table";

import type { Invitation } from "./invitations-columns";

interface InvitationsDesktopDataTableProps {
  invitations: Invitation[];
  columns: ColumnDef<Invitation>[];
  page: number;
  noResultsMessage: string;
  onPaginationChange: (updater: Updater<PaginationState>) => void;
}

export const InvitationsDesktopDataTable = ({
  invitations,
  columns,
  page,
  noResultsMessage,
  onPaginationChange,
}: InvitationsDesktopDataTableProps) => {
  return (
    <DataTable
      data={invitations}
      columns={columns}
      pagination={{ pageIndex: page - 1, pageSize: 10 }}
      onPaginationChange={onPaginationChange}
    >
      <DataTableSearch />
      <DataTableContent noResultsMessage={noResultsMessage} />
      <DataTablePagination />
    </DataTable>
  );
};
