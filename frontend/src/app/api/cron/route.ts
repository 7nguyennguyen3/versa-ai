import { NextRequest, NextResponse } from "next/server";

export async function POST(nextRequest: NextRequest) {
  const { db } = await import("@/lib/firebaseAdmin");

  // Check for the Authorization header
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

  return NextResponse.json(
    { message: "Cron job executed successfully." },
    { status: 200 }
  );
}
