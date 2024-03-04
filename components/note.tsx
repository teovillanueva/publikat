import { Info } from "lucide-react";
import React from "react";

interface NoteProps extends React.PropsWithChildren<{}> {
  title: string;
  description: string;
}

export function Note({ title, description, children }: NoteProps) {
  return (
    <div className="flex items-center justify-between bg-primary/20 border border-primary/50 p-4">
      <div className="flex gap-4">
        <Info className="text-primary/90" />
        <div>
          <h3 className="text-primary/90 font-semibold leading-none">
            {title}
          </h3>
          <p className="text-primary/80 text-sm mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
