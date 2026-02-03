"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Loader2, ImagePlus } from "lucide-react";

type UploadStatus = "uploading" | "done" | "error";

interface FileState {
  id: string;
  file?: File;
  name: string;
  status: UploadStatus;
  url?: string;
  error?: string | null;
}

interface ImageUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
  thumbs: string[];
}

export function ImageUpload({ files, setFiles, thumbs }: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleRemove = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  // Función para extraer el nombre base del archivo de una URL
  const getFilenameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      // Remover el sufijo aleatorio de Vercel Blob (formato: filename-xyz.ext)
      const filename = pathname.split("/").pop() || "";
      // Remover el sufijo aleatorio (formato: -xyz antes de la extensión)
      return filename.replace(/-\w{7}(\.[a-zA-Z0-9]+)$/, "$1");
    } catch {
      // Si falla el parsing, devolver el nombre original
      return url.split("/").pop() || url;
    }
  };

  const onSelectFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const fileArray = Array.from(fileList);
    const duplicateNames = fileArray
      .filter((f) => files.some((existing) => existing.name === f.name))
      .map((f) => f.name);
    if (duplicateNames.length) {
      setError(
        `Los siguientes archivos ya existen: ${duplicateNames.join(", ")}`,
      );
      setTimeout(() => setError(null), 5000);
    }
    const validFiles = fileArray.filter(
      (f) =>
        allowedTypes.includes(f.type) &&
        f.size <= maxSize &&
        !files.some((existing) => existing.name === f.name),
    );
    setFiles([...files, ...validFiles]);
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <div className="flex flex-col gap-4 md:inline">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onSelectFiles(e.target.files)}
      />
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="bg-accent hover:bg-accent/90 mb-4 flex items-center gap-2 font-medium text-white"
      >
        <ImagePlus className="size-4" />
        <span>Subir imágenes</span>
      </Button>
      <div className="flex flex-wrap gap-2">
        {thumbs.map((thumb, idx) => (
          <span
            key={thumb}
            className="inline-flex items-center gap-2 rounded-full bg-zinc-800 px-2 py-1 text-white"
          >
            <img
              src={thumb}
              alt={files[idx]?.name || "imagen"}
              className="size-8 rounded object-cover"
            />
            <span className="max-w-40 truncate">{files[idx]?.name}</span>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="ml-2 flex items-center justify-center rounded-full bg-black/40"
            >
              <X className="size-6 text-white" />
            </button>
          </span>
        ))}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
