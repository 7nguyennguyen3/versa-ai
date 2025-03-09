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

    const chatSessions = sessionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const lastActivity = data.last_activity
        ? data.last_activity.toDate() // Convert Firestore Timestamp to JavaScript Date
        : null;

      return {
        chat_session_id: doc.id,
        chat_history: data.chat_history || [],
        last_activity: lastActivity, // Send as JavaScript Date
        latest_pdfId: data.latest_pdfId || null,
        title: data.title || null,
      };
    });

    return NextResponse.json(chatSessions, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
