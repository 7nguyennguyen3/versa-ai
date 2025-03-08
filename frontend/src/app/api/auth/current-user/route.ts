import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserDetail } from "@/app/_global/interface";
import { db } from "@/lib/firebaseAdmin";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        authenticated: false,
        name: null,
        role: null,
        tokenExpiresAt: null,
        plan: null,
        monthlyUploadUsage: 0,
        monthlyUploadLimit: 0,
      },
      { status: 200 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserDetail & {
      exp: number;
    };
    const userRef = await db.collection("users").doc(decoded.id).get();

    return NextResponse.json({
      authenticated: true,
      userId: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: userRef.data()?.role || "user",
      plan: userRef.data()?.plan || "free",
      monthlyUploadUsage: userRef.data()?.monthlyUploadUsage || 0,
      monthlyUploadLimit: userRef.data()?.monthlyUploadLimit || 0,
      tokenExpiresAt: new Date(decoded.exp * 1000).toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        name: null,
        role: null,
        plan: null,
        monthlyUploadUsage: 0,
        monthlyUploadLimit: 0,
        tokenExpiresAt: null,
      },
      { status: 400 }
    );
  }
}
