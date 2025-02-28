import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const DEMO_SECRET = process.env.DEMO_SECRET;
const API_URL = process.env.NEXT_PUBLIC_CHAT_ENDPOINT;

export async function POST(request: NextRequest) {
  try {
    const { pdfId, message, chat_session_id } = await request.json();

    if (!pdfId || !message) {
      console.error("Missing field:", { pdfId, message });
      return NextResponse.json({ error: "Missing field" }, { status: 400 });
    }

    await axios.post(`${API_URL}/demo_chat_send`, {
      message,
      chat_session_id,
      demo_secret: DEMO_SECRET,
      pdf_id: pdfId,
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/chat/demo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
