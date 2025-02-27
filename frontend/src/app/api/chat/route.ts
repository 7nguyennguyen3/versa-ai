import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Query Firestore for all chat sessions belonging to the user
    const sessionsSnapshot = await db
      .collection("sessions")
      .where("userId", "==", userId)
      .get();

    if (sessionsSnapshot.empty) {
      return NextResponse.json(
        { message: "No chat history found." },
        { status: 404 }
      );
    }

    const chatSessions = sessionsSnapshot.docs.map((doc) => ({
      chat_session_id: doc.id,
      chat_history: doc.data().chat_history || [],
      last_activity: doc.data().last_activity || null,
      latest_pdfId: doc.data().latest_pdfId || null,
    }));

    return NextResponse.json(chatSessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
