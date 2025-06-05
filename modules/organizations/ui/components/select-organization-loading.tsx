import { Loader2Icon } from "lucide-react";

export const SelectOrganizationLoading = () => {
  return (
    <div className="py-4 px-8 flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-y-6 p-10">
        <Loader2Icon className="size-6 animate-spin" />
        <p className="text-lg">Loading organizations...</p>
      </div>
    </div>
  );
};
