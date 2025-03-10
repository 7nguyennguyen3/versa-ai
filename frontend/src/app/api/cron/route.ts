import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET(nextRequest: NextRequest) {
  try {
    const authHeader = nextRequest.headers.get("Authorization");

    // Verify the token format: "Bearer <secret>"
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reset monthly upload usage
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    const batch = db.batch();

    snapshot.forEach((doc) => {
      const userRef = usersRef.doc(doc.id);
      batch.update(userRef, { monthlyUploadUsage: 0 });
    });

    await batch.commit();
    console.log("Monthly upload usage reset for all users.");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to execute cron job." },
      { status: 500 }
    );
  }
}
