import { type LucideIcon } from "lucide-react";
import React from "react";

import { Card, CardContent } from "@app/ui/components/card";
import { cn } from "@app/ui/lib/utils";

type ViewSectionProps = {
  title: string;
  description: string;
  insideCard?: boolean;
  children: React.ReactNode | React.ReactNode[];
  Icon: LucideIcon;
  viewVariant?: "default" | "destructive";
  iconVariant?: "default" | "destructive";
};

export const ViewSection = ({
  title,
  description,
  insideCard = true,
  Icon,
  children,
  viewVariant = "default",
  iconVariant = "default",
}: ViewSectionProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 space-y-4">
      <div className="lg:col-span-1">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Icon className={cn("size-5", iconVariant === "destructive" && "text-destructive")} />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="lg:col-span-2 space-y-4">
        {React.Children.map(children, (child, index) =>
          insideCard ? (
            <Card
              className={cn(
                viewVariant === "destructive" &&
                  "border-destructive/30 bg-destructive/5 dark:bg-destructive/10",
              )}
              key={`view-card-${index}`}
            >
              <CardContent className="space-y-4">{child}</CardContent>
            </Card>
          ) : (
            child
          ),
        )}
      </div>
    </div>
  );
};
