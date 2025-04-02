import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/firebaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
  // Try both ways of getting cookies
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userRef = await db
      .collection("users")
      .doc(decoded.id.toString())
      .get();

    if (!userRef.exists) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      userId: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: userRef.data()?.role || "user",
      plan: userRef.data()?.plan || "free",
      monthlyUploadUsage: userRef.data()?.monthlyUploadUsage || 0,
      monthlyUploadLimit: userRef.data()?.monthlyUploadLimit || 10,
      tokenExpiresAt: new Date(decoded.exp * 1000).toISOString(),
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
