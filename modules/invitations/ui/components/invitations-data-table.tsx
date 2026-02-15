"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
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
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { createInvitationColumns } from "./invitations-columns";

export const InvitationsDataTable = () => {
  const t = useTranslations("invitations");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: invitations } = useSuspenseQuery(
    trpc.invitations.getMany.queryOptions(),
  );

  const cancelInvitation = useMutation(
    trpc.invitations.cancel.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.invitations.getMany.queryOptions(),
        );
        toast.success(t("canceled"));
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const columns = createInvitationColumns(
    (invitationId) => cancelInvitation.mutate({ invitationId }),
    cancelInvitation.isPending,
    t,
  );

  const table = useReactTable({
    data: invitations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (invitations.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          {t("emptyState")}
        </p>
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
            <TableRow key={row.id}>
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
