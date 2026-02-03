import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";

export async function POST(request: Request) {
  // only allow authenticated admin users to upload
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 },
      );
    }

    // Validar tamaño (ejemplo: 10MB máximo)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Subir a Vercel Blob con sufijo aleatorio para evitar duplicados
    let blob;
    try {
      blob = await put(file.name, file, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: true, // ← Esto genera nombres únicos
      });
    } catch (err: any) {
      console.error("Vercel Blob put error:", err);
      return NextResponse.json(
        {
          error: "Failed to upload to blob storage",
          detail: err?.message || String(err),
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        downloadUrl: blob.downloadUrl,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// ... (el resto del código DELETE se mantiene igual)
export async function DELETE(request: Request) {
  // only allow authenticated admin users to delete blobs
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { url, pathname } = body || {};

    if (!url && !pathname) {
      return NextResponse.json(
        { error: "No url or pathname provided" },
        { status: 400 },
      );
    }

    // Determine target: prefer explicit pathname. If a full URL was provided,
    // convert it to pathname + search so `del` receives the correct identifier
    // for Vercel Blob. This prevents accidentally passing an absolute URL.
    let target = pathname || url;
    try {
      if (typeof target === "string" && /^https?:\/\//.test(target)) {
        const u = new URL(target);
        // include search/query to preserve any signed tokens or params
        target = u.pathname + u.search;
      }
    } catch (parseErr) {
      console.warn(
        "Could not parse provided url for deletion, using original:",
        target,
        parseErr,
      );
    }

    // call vercel blob del with normalized pathname
    await del(target, { token: process.env.BLOB_READ_WRITE_TOKEN });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blob error:", error);
    return NextResponse.json(
      { error: "Failed to delete blob" },
      { status: 500 },
    );
  }
}
