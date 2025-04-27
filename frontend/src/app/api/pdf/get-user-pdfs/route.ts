import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch the cacheBuster for the user
    const userDoc = await db.collection("users").doc(userId).get();
    const cacheBuster = userDoc.exists ? userDoc.data()?.cacheBuster : null;

    // Fetch PDFs for the user
    const snapshot = await db
      .collection("pdfs")
      .where("userId", "==", userId)
      .get();

    const pdfs = snapshot.docs.map((doc) => ({
      pdfIngestionStatus: doc.data().ingestionStatus,
      pdfId: doc.data().pdfId,
      pdfUrl: doc.data().pdfUrl,
      uploadedAt: doc.data().uploadedAt,
      pdfName: doc.data().pdfName,
      summary: doc.data().summary ?? "No Summary Available",
    }));

    // Include cacheBuster in the response
    const response = NextResponse.json({ pdfs, cacheBuster });
    response.headers.set("Cache-Control", "public, s-maxage=360000");
    return response;
  } catch (error) {
    console.error("Error retrieving PDFs:", error);
    return NextResponse.json(
      { error: "Failed to retrieve PDFs" },
      { status: 500 }
    );
  }
}
