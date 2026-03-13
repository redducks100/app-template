"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useRef } from "react";

import { cn } from "../../lib/utils";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <InputGroup className={cn("w-full max-w-sm", className)}>
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

export { SearchInput };
export type { SearchInputProps };
