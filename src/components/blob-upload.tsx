"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function BlobUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          setUploadedUrls((prev) => [...prev, data.blob.url]);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
            />

            {uploading && (
              <p className="text-muted-foreground text-sm">
                Subiendo imágenes a Vercel Blob...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {uploadedUrls.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 font-semibold">Imágenes subidas:</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <img
                    src={url}
                    alt={`Uploaded ${index}`}
                    className="h-32 w-full rounded-lg border object-cover"
                  />
                  <p className="text-muted-foreground truncate text-xs">
                    {url.split("/").pop()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
