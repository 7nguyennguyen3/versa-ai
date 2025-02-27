import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If no token exists, user is already signed out
  if (!token) {
    return NextResponse.json({ message: "Already signed out" });
  }

  // Create a response object
  const response = NextResponse.json({
    message: "Signout successful",
  });

  // Remove the JWT token cookie by setting it to an empty value with an immediate expiry
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0, // Immediately expire the cookie
  });

  return response;
}
