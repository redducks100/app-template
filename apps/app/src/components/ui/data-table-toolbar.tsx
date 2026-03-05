import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataTableToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DataTableToolbar({
  value,
  onChange,
  placeholder,
}: DataTableToolbarProps) {
  const { t } = useTranslation("common");

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("searchPlaceholder")}
        className="pl-8"
      />
    </div>
  );
}
