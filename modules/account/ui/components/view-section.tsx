import { Card, CardContent } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";
import { type LucideIcon } from "lucide-react";
import React from "react";

type ViewSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode | React.ReactNode[];
  Icon: LucideIcon;
};

const viewSectionVariants = cva("", {
  variants: {
    viewVariant: {
      default: "",
      destructive: "border-destructive/30 bg-destructive/5",
    },
  },
  defaultVariants: {
    viewVariant: "default",
  },
});

const iconViewSectionVariants = cva("size-5", {
  variants: {
    iconVariant: {
      default: "",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    iconVariant: "default",
  },
});

export const ViewSection = ({
  title,
  description,
  Icon,
  children,
  viewVariant = "default",
  iconVariant = "default",
}: ViewSectionProps &
  VariantProps<typeof viewSectionVariants> &
  VariantProps<typeof iconViewSectionVariants>) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 space-y-4">
      <div className="lg:col-span-1">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Icon className={iconViewSectionVariants({ iconVariant })} />
          {title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="lg:col-span-2 space-y-4">
        {React.Children.map(children, (child, index) => (
          <Card
            className={viewSectionVariants({ viewVariant })}
            key={`view-card-${index}`}
          >
            <CardContent className="space-y-4">{child}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
