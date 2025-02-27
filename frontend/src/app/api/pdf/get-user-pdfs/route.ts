import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const snapshot = await db
      .collection("pdfs")
      .where("userId", "==", userId)
      .get();

    const pdfs = snapshot.docs.map((doc) => ({
      pdfId: doc.data().pdfId,
      pdfUrl: doc.data().pdfUrl,
      uploadedAt: doc.data().uploadedAt,
      pdfName: doc.data().pdfName,
    }));

    return NextResponse.json(pdfs);
  } catch (error) {
    console.error("Error retrieving PDFs:", error);
    return NextResponse.json(
      { error: "Failed to retrieve PDFs" },
      { status: 500 }
    );
  }
}
