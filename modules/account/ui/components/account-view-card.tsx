"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

type AccountViewCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  Icon: LucideIcon;
};

export const AccountViewCard = ({
  title,
  description,
  Icon,
  children,
}: AccountViewCardProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-1 hidden lg:block">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Icon className="size-5" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <Card className="lg:col-span-2">
        <CardHeader className="lg:hidden">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Icon className="size-6" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  );
};
