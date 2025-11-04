import { Card, CardContent } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import React from "react";

type AccountViewCardProps = {
  title: string;
  description: string;
  children: React.ReactNode | React.ReactNode[];
  Icon: LucideIcon;
};

export const AccountViewCard = ({
  title,
  description,
  Icon,
  children,
}: AccountViewCardProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 space-y-4">
      <div className="lg:col-span-1">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Icon className="size-5" />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="lg:col-span-2 space-y-4">
        {React.Children.map(children, (child, index) => (
          <Card key={`view-card-${index}`}>
            <CardContent className="space-y-4">{child}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
