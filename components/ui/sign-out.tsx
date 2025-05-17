"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      disabled={loading}
      onClick={() => {
        setLoading(true);
      }}
    >
      Sign out
    </Button>
  );
}
