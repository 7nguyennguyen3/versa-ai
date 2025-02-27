import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserDetail } from "@/app/_global/interface";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, name: null, role: null, tokenExpiresAt: null },
      { status: 200 }
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserDetail & {
      exp: number;
    };

    return NextResponse.json({
      authenticated: true,
      userId: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      tokenExpiresAt: new Date(decoded.exp * 1000).toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, name: null, role: null, tokenExpiresAt: null },
      { status: 200 }
    );
  }
}
