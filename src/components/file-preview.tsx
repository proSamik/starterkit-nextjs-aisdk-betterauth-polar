"use client";

import { X, FileText, Download, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import Image from "next/image";

interface FilePreviewProps {
  file: {
    name: string;
    type: string;
    url: string;
    size?: number;
  };
  onRemove?: () => void;
  className?: string;
  showRemoveButton?: boolean;
  onLoaded?: () => void;
  isUploading?: boolean;
}

/**
 * Displays appropriate preview based on file type with proper error handling
 */
export function FilePreview({
  file,
  onRemove,
  className,
  showRemoveButton = true,
  onLoaded,
  isUploading = false,
}: FilePreviewProps) {
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(isImage);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setImageError(false);
    onLoaded?.();
  }, [onLoaded]);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageError(true);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      className={cn(
        "relative group rounded-lg border border-border overflow-hidden bg-muted/30",
        className,
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Remove button */}
      {showRemoveButton && onRemove && (
        <Button
          onClick={onRemove}
          size="icon"
          variant="destructive"
          className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="h-3 w-3" />
        </Button>
      )}

      {/* Image preview */}
      {isImage && (
        <div className="relative w-full h-full min-h-[120px]">
          {/* Upload placeholder */}
          {isUploading && (
            <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground">
              <Upload className="h-8 w-8 mb-2 animate-bounce" />
              <span className="text-xs text-center px-2">Uploading...</span>
            </div>
          )}

          {/* Image */}
          {!imageError && !isUploading && (
            <Image
              src={file.url}
              alt={file.name}
              layout="fill"
              objectFit="contain"
              className={cn(
                "min-h-[120px] transition-opacity duration-200",
                isLoading ? "opacity-0" : "opacity-100",
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}

          {/* Loading state */}
          {isLoading && !isUploading && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error state */}
          {imageError && !isUploading && (
            <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="h-8 w-8 mb-2" />
              <span className="text-xs text-center px-2">
                Image unavailable
              </span>
            </div>
          )}

          {/* Overlay with file info */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs truncate" title={file.name}>
              {file.name}
            </p>
            {file.size && (
              <p className="text-xs text-gray-300">
                {formatFileSize(file.size)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* PDF preview */}
      {isPdf && (
        <div className="flex flex-col items-center justify-center p-4 min-h-[120px]">
          {isUploading ? (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-2 animate-bounce" />
              <p className="text-sm font-medium text-center">
                Uploading PDF...
              </p>
            </>
          ) : (
            <>
              <FileText className="h-12 w-12 text-red-500 mb-2" />
              <p
                className="text-sm font-medium text-center truncate w-full"
                title={file.name}
              >
                {file.name}
              </p>
              {file.size && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="mt-2"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </>
          )}
        </div>
      )}

      {/* Generic file preview for unsupported types */}
      {!isImage && !isPdf && (
        <div className="flex flex-col items-center justify-center p-4 min-h-[120px]">
          {isUploading ? (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-2 animate-bounce" />
              <p className="text-sm font-medium text-center">
                Uploading file...
              </p>
            </>
          ) : (
            <>
              <FileText className="h-12 w-12 text-muted-foreground mb-2" />
              <p
                className="text-sm font-medium text-center truncate w-full"
                title={file.name}
              >
                {file.name}
              </p>
              {file.size && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
              <Button
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="mt-2"
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

/**
 * Lightweight text file preview for chat messages
 */
export function TextFilePreview({
  file,
  maxLength = 100,
}: {
  file: { name: string; url: string };
  maxLength?: number;
}) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchTextContent = useCallback(async () => {
    try {
      const response = await fetch(file.url);
      const text = await response.text();
      setContent(text.slice(0, maxLength));
    } catch (error) {
      console.error("Failed to fetch text content:", error);
      setContent("Unable to load text content");
    } finally {
      setLoading(false);
    }
  }, [file.url, maxLength]);

  // Call fetchTextContent when component mounts
  useState(() => {
    void fetchTextContent();
  });

  if (loading) {
    return (
      <div className="text-xs text-muted-foreground animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-xs text-muted-foreground border rounded p-2 bg-muted/30 max-w-xs">
      <p className="font-medium mb-1">{file.name}</p>
      <p className="whitespace-pre-wrap">
        {content}
        {content.length >= maxLength && "..."}
      </p>
    </div>
  );
}

/**
 * Grid container for multiple file previews
 */
export function FilePreviewGrid({
  files,
  onRemoveFile,
  className,
  onFileLoaded,
  uploadingFiles = [],
}: {
  files: Array<{ name: string; type: string; url: string; size?: number }>;
  onRemoveFile?: (index: number) => void;
  className?: string;
  onFileLoaded?: (url: string) => void;
  uploadingFiles?: Array<{ name: string; type: string }>;
}) {
  return (
    <AnimatePresence>
      <div
        className={cn(
          "w-full grid gap-2",
          "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
          className,
        )}
      >
        {/* Show uploading files first */}
        {uploadingFiles.map((file, index) => (
          <FilePreview
            key={`uploading-${file.name}-${index}`}
            file={{
              name: file.name,
              type: file.type,
              url: "", // Empty URL for uploading files
            }}
            showRemoveButton={false}
            isUploading={true}
            className="w-full aspect-square"
          />
        ))}

        {/* Show uploaded files */}
        {files.map((file, index) => (
          <FilePreview
            key={`uploaded-${file.name}-${index}`}
            file={file}
            onRemove={onRemoveFile ? () => onRemoveFile(index) : undefined}
            showRemoveButton={!!onRemoveFile}
            onLoaded={() => onFileLoaded?.(file.url)}
            className="w-full aspect-square"
          />
        ))}
      </div>
    </AnimatePresence>
  );
}
