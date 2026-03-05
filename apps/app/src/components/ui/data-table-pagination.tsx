import { Button } from "@/components/ui/button";
import type { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation("common");

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);
  const pageCount = table.getPageCount();

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {t("pagination.showing", { from, to, total: totalRows })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label={t("pagination.previous")}
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm text-muted-foreground">
          {t("pagination.page", { page: pageIndex + 1, total: pageCount })}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label={t("pagination.next")}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
