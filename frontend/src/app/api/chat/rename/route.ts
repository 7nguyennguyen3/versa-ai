import { db } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { chatId, newTitle } = await request.json();
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate the chatId and newTitle
  if (!chatId || !newTitle) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Update the chat title in the database
  const chatSession = await db.collection("sessions").doc(chatId).get();
  if (!chatSession.exists) {
    return NextResponse.json(
      { error: "Chat session not found" },
      { status: 404 }
    );
  }

  // Update the title
  await db.collection("sessions").doc(chatId).update({
    title: newTitle,
  });

  return NextResponse.json(
    { message: "Chat renamed successfully" },
    { status: 200 }
  );
}
