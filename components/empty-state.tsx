import React from "react";

interface EmptyStateProps extends React.PropsWithChildren<{}> {
  icon: React.ReactElement;
  title: string;
  description: string;
}

export function EmptyState({
  icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full pb-4 px-8">
      {React.cloneElement(icon, {
        className: "w-24 h-24 stroke-1 text-muted-foreground",
      })}
      <h2 className="text-2xl font-semibold mt-6 stroke">{title}</h2>
      <p className="text-center text-sm mt-2 text-muted-foreground">
        {description}
      </p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
