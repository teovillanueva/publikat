"use client";

import { cn } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import { Spinner } from "./ui/spinner";

interface FileDropzoneProps {
  supportedFileTypes?: string[];
  loading?: boolean;
  onDrop?: (file: File) => void;
}

export function FileDropzone({
  supportedFileTypes,
  loading,
  onDrop,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop(files) {
      onDrop?.(files[0]);
    },
  });

  return (
    <div
      className="p-x py-12 cursor-pointer border-dashed border-2 text-center flex flex-col justify-center"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {loading && <Spinner className="absolute self-center" />}

      <div className="space-y-1">
        <p className={cn("text-sm font-medium", loading && "opacity-0")}>
          {isDragActive
            ? "Drop the file here"
            : "Drag and drop your file here, or click to select a file"}
        </p>

        <p
          className={cn(
            "text-xs text-muted-foreground",
            loading && "opacity-0"
          )}
        >
          {supportedFileTypes
            ? `Supported file types: ${supportedFileTypes.join(", ")}`
            : "No file type restrictions"}
        </p>
      </div>
    </div>
  );
}
