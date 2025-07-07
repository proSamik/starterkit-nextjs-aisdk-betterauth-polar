import { NextRequest, NextResponse } from "next/server";
import { uploadFileToR2, isSupportedFileType } from "@/lib/cloudflare-r2";
import { getSession } from "auth/server";

/**
 * API route to handle file uploads to Cloudflare R2
 * Supports images and PDFs, returns public URLs
 */
export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Validate file types and size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    for (const file of files) {
      if (!isSupportedFileType(file.type)) {
        return NextResponse.json(
          {
            error: `Unsupported file type: ${file.type}. Only images and PDFs are allowed.`,
          },
          { status: 400 },
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum size is 10MB.` },
          { status: 400 },
        );
      }
    }

    // Upload files to R2
    const uploadPromises = files.map(async (file) => {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const result = await uploadFileToR2(buffer, file.name, file.type);

      return {
        name: file.name,
        type: file.type,
        size: file.size,
        url: result.url,
        key: result.key,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 },
    );
  }
}
