import { storage } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const [files] = await storage
      .bucket()
      .getFiles({ prefix: `pdfs/${userId}/` });

    const pdfs = files.map((file) => ({
      name: file.name.split("/").pop(),
      url: `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${file.name}`,
    }));

    return NextResponse.json({ pdfs });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve PDFs", details: (error as Error).message },
      { status: 500 }
    );
  }
}
